const Dashboard = () => {

  const token = localStorage.getItem("token");

  return (
    <div>

      <h1>Dashboard 🔥</h1>

      <p>User Logged In Successfully</p>

      <p>Token:</p>

      <textarea
        rows="10"
        cols="70"
        value={token}
        readOnly
      />

    </div>
  );
};

export default Dashboard;