export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false
}) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
    secondary:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}
