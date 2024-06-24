function AuthLayout({ children }) {
  return (
    <div className="h-full flex flex-col gap-2 items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
