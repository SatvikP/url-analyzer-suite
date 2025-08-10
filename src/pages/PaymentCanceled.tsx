const PaymentCanceled = () => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Payment Canceled</h1>
        <p className="text-muted-foreground">No worries—your card wasn’t charged.</p>
        <a href="/" className="underline">Return home</a>
      </section>
    </main>
  );
};
export default PaymentCanceled;
