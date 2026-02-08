import React, {
    useRef,
    useState,
} from "react";
import PropTypes from "prop-types";

const API = import.meta.env.VITE_API_BASE_URL || '';

const InterestForm = ( {setOpen, setSubmitted, errors, setErrors} ) => {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [loading, setLoading] = useState(false);

    // Refs to focus invalid fields
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // clear per-field error as user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        // if user fills either email/phone, clear the global contact error
        if ((name === "email" && value) || (name === "phone" && value)) {
            setErrors((prev) => ({ ...prev, contact: "" }));
        }
    };

    const focusFirstError = (errObj) => {
        if (errObj.name) {
            nameRef.current?.focus();
        } else if (errObj.email) {
            emailRef.current?.focus();
        } else if (errObj.phone) {
            phoneRef.current?.focus();
        } else if (errObj.contact) {
            // if contact missing, focus email if empty else phone
            if (!form.email || !form.email.trim()) {
                emailRef.current?.focus();
            } else {
                phoneRef.current?.focus();
            }
        }
    };

    /**
     * Validate form and return an object with errors.
     * Also sets the errors state.
     * - name required
     * - one of email/phone required
     * - email format if provided
     * - phone: allow formatted phone (spaces, -, parentheses, leading +),
     *   but require digit count (10-15)
     */
    const validateForm = () => {
        const newErrors = {};

        // Name required
        if (!form.name || !form.name.trim()) {
            newErrors.name = "Please enter your name.";
        } else if (form.name.trim().length > 100) {
            newErrors.name = "Name is too long.";
        }

        // At least one contact method required
        const hasEmail = Boolean(form.email && form.email.trim());
        const hasPhone = Boolean(form.phone && form.phone.trim());

        if (!hasEmail && !hasPhone) {
            newErrors.contact =
                "Please provide either an email address or a phone number.";
        }

        // Email validation (if provided)
        if (hasEmail) {
            const email = form.email.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = "Please enter a valid email address.";
            } else if (email.length > 254) {
                newErrors.email = "Email is too long.";
            }
        }

        // Phone validation (if provided)
        if (hasPhone) {
            const rawPhone = form.phone.trim();
            // allow digits, spaces, +, -, parentheses
            const phoneCharsValid = /^\+?[\d\s()+-]+$/.test(rawPhone);
            const digitsOnly = rawPhone.replace(/\D/g, "");
            if (!phoneCharsValid) {
                newErrors.phone =
                    "Phone number can contain only digits, spaces, +, - and parentheses.";
            } else if (digitsOnly.length < 10) {
                newErrors.phone =
                    "Please enter a valid phone number (at least 10 digits).";
            } else if (digitsOnly.length > 15) {
                newErrors.phone = "Phone number appears too long.";
            }
        }

        setErrors(newErrors);
        return newErrors;
    };

    const normalizePhone = (phone) => {
        if (typeof phone !== "string") return "";
        const trimmed = phone.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("+")) {
            return "+" + trimmed.slice(1).replace(/\D/g, "");
        }
        return trimmed.replace(/\D/g, "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate first — keep modal open and focus first invalid field if any.
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            // focus first invalid field immediately
            focusFirstError(newErrors);
            return;
        }

        // If valid, proceed to submit
        setLoading(true);
        try {
            const payload = {
                ...form,
                phone: normalizePhone(form.phone),
            };
            const res = await fetch(
                new URL("/api/interest", API || undefined),
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (res.ok) {
                setSubmitted(true);
                setOpen(false);
                setForm({ name: "", email: "", phone: "" });
                setErrors({});
            } else {
                // try to read server error message
                let msg = "Something went wrong. Please try again.";
                try {
                    const body = await res.json();
                    if (body && body.message) msg = body.message;
                } catch (parsingError) {
                    console.error('Failed to parse error response:', parsingError);
                }
                alert(msg);
            }
        } catch (err) {
            alert("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <h2 id="modal-title">Join the Waitlist</h2>

            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                id="name"
                name="name"
                type="text"
                ref={nameRef}
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Name"
                disabled={loading}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'err-name' : undefined}
                />
                {errors.name && (
                <span className="error-message" id="err-name" role="alert">
                    {errors.name}
                </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                id="email"
                name="email"
                type="email"
                ref={emailRef}
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className={errors.email ? 'error' : ''}
                disabled={loading}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'err-email' : undefined}
                />
                {errors.email && (
                <span className="error-message" id="err-email" role="alert">
                    {errors.email}
                </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                id="phone"
                name="phone"
                type="tel"
                ref={phoneRef}
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className={errors.phone ? 'error' : ''}
                disabled={loading}
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'err-phone' : undefined}
                />
                {errors.phone && (
                <span className="error-message" id="err-phone" role="alert">
                    {errors.phone}
                </span>
                )}
            </div>

            {/* Global contact error (either email or phone required) */}
            {errors.contact && (
                <div className="form-group">
                <span className="error-message" role="alert" id="err-contact">
                    {errors.contact}
                </span>
                </div>
            )}

            <p className="form-disclaimer">
                Be the first customers and get exclusive coupons. Leave your details and we will contact you.
            </p>

            <button
                className={`submit-button ${loading ? 'loading' : ''}`}
                type="submit"
                disabled={loading}
                aria-busy={loading ? 'true' : 'false'}
            >
                {loading ? 'Submitting…' : 'Submit'}
            </button>
        </form>
    );
};

InterestForm.propTypes = {
  setOpen: PropTypes.func,
  setSubmitted: PropTypes.func,
  errors: PropTypes.object,
  setErrors: PropTypes.func,
};

export default InterestForm;