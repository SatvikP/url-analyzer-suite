const PaymentSuccess = () => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Payment Successful</h1>
        <p className="text-muted-foreground">Thanks for upgrading! You can close this tab.</p>
        <a href="/" className="underline">Return home</a>
      </section>
    </main>
  );
};
export default PaymentSuccess;
