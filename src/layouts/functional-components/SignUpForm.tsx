import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FiEye, FiEyeOff } from "react-icons/fi";

export interface FormData {
  firstName?: string;
  email: string;
  password: string;
}

const SignUpForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append("firstName", formData.firstName || "");
      form.append("email", formData.email);
      form.append("password", formData.password);

      const response = await fetch("/api/registrarse", {
        method: "POST",
        body: form,
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();

        if (response.ok) {
          setErrorMessages([]);
          localStorage.setItem("user", JSON.stringify(responseData));
          window.location.href = "/";
        } else {
          const errors = responseData.errors || [
            { message: "Sign-up failed." },
          ];
          setErrorMessages(errors.map((error: any) => error.message));
        }
      } else {
        setErrorMessages(["Invalid response from the server."]);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrorMessages(["An error occurred. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return "Recomendación: La contraseña debe tener al menos 8 caracteres.";
    } else if (!/[A-Z]/.test(password)) {
      return "Recomendación: La contraseña debe contener al menos una letra mayúscula.";
    } else if (!/\d/.test(password)) {
      return "Recomendación: La contraseña debe contener al menos un número.";
    } else {
      return "La contraseña es segura.";
    }
  };

  const passwordFeedback = validatePassword(formData.password);

  // Validar si la contraseña es segura
  const isPasswordSecure = passwordFeedback === "La contraseña es segura.";

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-11 sm:col-9 md:col-7 mx-auto">
            <div className="mb-14 text-center">
              <h2 className="max-md:h1 md:mb-2">Crear una cuenta</h2>
              <p className="md:text-lg">
                Crea una cuenta para comprar productos
              </p>
            </div>

            <form onSubmit={handleSignUp}>
              <div>
                <label className="form-label">Nombre</label>
                <input
                  name="firstName"
                  className="form-input"
                  placeholder="Escribe tu nombre"
                  type="text"
                  onChange={handleChange}
                  value={formData.firstName}
                  required
                />
              </div>

              <div>
                <label className="form-label mt-8">Correo electrónico</label>
                <input
                  name="email"
                  className="form-input"
                  placeholder="Escribe tu correo"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>

              <div className="relative">
                <label className="form-label mt-8">Contraseña</label>
                <div className="flex items-center">
                  <input
                    name="password"
                    className="form-input"
                    placeholder="********"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 text-gray-500"
                    aria-label="Mostrar contraseña"
                  >
                    {showPassword ? (
                      <FiEyeOff size={25} />
                    ) : (
                      <FiEye size={25} />
                    )}
                  </button>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    isPasswordSecure ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {passwordFeedback}
                </p>
              </div>

              {errorMessages.length > 0 &&
                errorMessages.map((error, index) => (
                  <p key={index} className="font-medium text-red-500 mt-2">
                    *{error}
                  </p>
                ))}

              <button
                type="submit"
                className="btn btn-primary md:text-lg md:font-medium w-full mt-10"
                disabled={!isPasswordSecure || loading}
              >
                {loading ? (
                  <BiLoaderAlt className="animate-spin mx-auto" size={26} />
                ) : (
                  "Registrarse"
                )}
              </button>
            </form>

            <div className="flex gap-x-2 text-sm md:text-base mt-6">
              <p className="text-light dark:text-darkmode-light">
                He leído y acepto los
              </p>
              <a
                className="underline font-medium text-dark dark:text-darkmode-dark"
                href="/terminos-servicios"
              >
                Términos y Condiciones
              </a>
            </div>

            <div className="flex gap-x-2 text-sm md:text-base mt-2">
              <p className="text-light dark:text-darkmode-light">
                ¿Ya tienes una cuenta?
              </p>
              <a
                className="underline font-medium text-dark dark:text-darkmode-dark"
                href="/iniciar-sesion"
              >
                Inicia sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
