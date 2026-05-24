import { useEffect, useMemo, useState } from "react";
import API from "./api/axios";

const emptyLogin = { email: "", password: "" };
const emptyRegister = {
  name: "",
  email: "",
  password: "",
  role: "patient",
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const slots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const formatPerson = (person) => person?.name || "Not assigned";

const getApiErrorMessage = (error, fallback) => {
  if (error.response?.status === 404) {
    return "Backend route not found. Restart the backend server so the latest routes are active.";
  }

  if (error.response?.status === 401) {
    return "Your login session expired. Sign out and login again.";
  }

  if (error.response?.status === 403) {
    return "Your account role is not allowed to open this data.";
  }

  return error.response?.data?.message || fallback;
};

function App() {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [user, setUser] = useState(getStoredUser);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  const isSignedIn = Boolean(localStorage.getItem("token") && user);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("info");

    try {
      const { data } = await API.post("/auth/login", loginForm);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setLoginForm(emptyLogin);
      setMessage("Login successful.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Wrong email or password.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("info");

    try {
      await API.post("/auth/register", registerForm);
      setRegisterForm(emptyRegister);
      setMode("login");
      setMessage("Account created. You can sign in now.");
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMode("login");
    setMessage("Signed out.");
    setMessageType("info");
  };

  if (!isSignedIn) {
    return (
      <main className="auth-page">
        <section className="auth-visual" aria-label="Hospital operations">
          <div className="brand-mark">
            <img src="/favicon.svg" alt="" />
            <span>MediCore</span>
          </div>
          <div className="auth-copy">
            <p>Hospital management</p>
            <h1>Appointments, doctors, schedules, and prescriptions in one connected workspace.</h1>
          </div>
        </section>

        <section className="auth-panel">
          <div className="tabs" role="tablist" aria-label="Auth mode">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Sign in
            </button>
            <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
              Register
            </button>
          </div>

          {message && <p className={`notice ${messageType}`} role={messageType === "error" ? "alert" : "status"}>{message}</p>}

          {mode === "login" ? (
            <form className="form" onSubmit={handleLogin}>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Password
                <input
                  required
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  placeholder="Your password"
                />
              </label>
              <button className="primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form className="form" onSubmit={handleRegister}>
              <label>
                Full name
                <input
                  required
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
                  placeholder="Dr. Asha Mehta"
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Password
                <input
                  required
                  minLength="6"
                  type="password"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                  placeholder="At least 6 characters"
                />
              </label>
              <label>
                Role
                <select
                  value={registerForm.role}
                  onChange={(event) => setRegisterForm({ ...registerForm, role: event.target.value })}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <button className="primary" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
          )}
        </section>
      </main>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

function Dashboard({ user, onLogout }) {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [busy, setBusy] = useState(false);

  const [booking, setBooking] = useState({
    doctorId: "",
    date: "",
    slot: slots[0],
  });
  const [schedule, setSchedule] = useState({
    day: "Monday",
    slots: "09:00 AM, 10:00 AM, 02:00 PM",
  });
  const [prescription, setPrescription] = useState({
    appointmentId: "",
    patientId: "",
    medicines: "",
    notes: "",
  });

  const roleTitle = useMemo(() => {
    if (user.role === "admin") return "Administration";
    if (user.role === "doctor") return "Doctor desk";
    return "Patient portal";
  }, [user.role]);

  const loadCommon = async () => {
    let response;
    try {
      response = await API.get("/doctors");
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error;
      }
      response = await API.get("/admin/doctors");
    }
    
    const { data } = response;
    setDoctors(data);
  };

  const loadRoleData = async () => {
    if (user.role === "patient") {
      const [appointmentsResponse, prescriptionsResponse] = await Promise.all([
        API.get("/appointments/patient"),
        API.get("/prescriptions/my"),
      ]);
      setAppointments(appointmentsResponse.data);
      setPrescriptions(prescriptionsResponse.data);
    }

    if (user.role === "doctor") {
      const { data } = await API.get("/appointments/doctor");
      setAppointments(data);
    }

    if (user.role === "admin") {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    }
  };

  const refresh = async () => {
    setBusy(true);
    setMessage("");
    setMessageType("info");
    try {
      await Promise.all([loadCommon(), loadRoleData()]);
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Could not load dashboard data."));
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (doctors.length && !booking.doctorId) {
      setBooking((current) => ({ ...current, doctorId: doctors[0]._id }));
    } else if (!doctors.length && booking.doctorId) {
      setBooking((current) => ({ ...current, doctorId: "" }));
    }
  }, [doctors, booking.doctorId]);

  const loadSchedule = async (doctorId) => {
    setSelectedDoctor(doctorId);
    if (!doctorId) {
      setSchedules([]);
      return;
    }

    try {
      const { data } = await API.get(`/schedules/${doctorId}`);
      setSchedules(data);
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Could not load schedule."));
      setMessageType("error");
    }
  };

  const bookAppointment = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setMessageType("info");

    try {
      if (!booking.doctorId) {
        setMessage("Please select a doctor before booking.");
        setMessageType("error");
        return;
      }
      await API.post("/appointments/book", booking);
      setMessage("Appointment booked.");
      setMessageType("success");
      await refresh();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Booking failed."));
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  };

  const createSchedule = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setMessageType("info");

    try {
      await API.post("/schedules/create", {
        day: schedule.day,
        slots: schedule.slots.split(",").map((slot) => slot.trim()).filter(Boolean),
      });
      setMessage("Schedule added.");
      setMessageType("success");
      setSchedule({ ...schedule, slots: "" });
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Schedule could not be saved."));
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    setBusy(true);
    setMessage("");
    setMessageType("info");

    try {
      await API.put(`/appointments/update/${appointmentId}`, { status });
      setMessage("Appointment updated.");
      setMessageType("success");
      await refresh();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Status update failed."));
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  };

  const createPrescription = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setMessageType("info");

    try {
      const medicines = prescription.medicines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, dosage] = line.split("-").map((part) => part.trim());
          return { name, dosage: dosage || "As advised" };
        });

      await API.post("/prescriptions/create", {
        appointmentId: prescription.appointmentId,
        patientId: prescription.patientId,
        medicines,
        notes: prescription.notes,
      });
      setMessage("Prescription created.");
      setMessageType("success");
      setPrescription({ appointmentId: "", patientId: "", medicines: "", notes: "" });
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Prescription failed."));
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  };

  const deleteDoctor = async (doctorId) => {
    setBusy(true);
    setMessage("");
    setMessageType("info");

    try {
      await API.delete(`/admin/doctor/${doctorId}`);
      setMessage("Doctor removed.");
      setMessageType("success");
      await refresh();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Doctor could not be removed."));
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <img src="/favicon.svg" alt="" />
          <span>MediCore</span>
        </div>
        <nav>
          <a href="#overview">Overview</a>
          {user.role === "patient" && <a href="#book">Book</a>}
          {user.role === "doctor" && <a href="#schedule">Schedule</a>}
          {user.role === "admin" && <a href="#doctors">Doctors</a>}
        </nav>
        <button className="secondary" onClick={onLogout}>Sign out</button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>{roleTitle}</p>
            <h1>Welcome, {user.name}</h1>
          </div>
          <button className="ghost" onClick={refresh} disabled={busy}>
            {busy ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {message && <p className={`notice ${messageType}`} role={messageType === "error" ? "alert" : "status"}>{message}</p>}

        <section id="overview" className="metrics">
          <article>
            <span>{doctors.length}</span>
            <p>Doctors</p>
          </article>
          <article>
            <span>{appointments.length}</span>
            <p>Appointments</p>
          </article>
          <article>
            <span>{user.role === "admin" ? stats?.totalPatients || 0 : prescriptions.length}</span>
            <p>{user.role === "admin" ? "Patients" : "Prescriptions"}</p>
          </article>
        </section>

        {user.role === "patient" && (
          <PatientView
            appointments={appointments}
            booking={booking}
            doctors={doctors}
            prescriptions={prescriptions}
            schedules={schedules}
            selectedDoctor={selectedDoctor}
            setBooking={setBooking}
            onBook={bookAppointment}
            onLoadSchedule={loadSchedule}
            busy={busy}
          />
        )}

        {user.role === "doctor" && (
          <DoctorView
            appointments={appointments}
            prescription={prescription}
            schedule={schedule}
            setPrescription={setPrescription}
            setSchedule={setSchedule}
            onCreatePrescription={createPrescription}
            onCreateSchedule={createSchedule}
            onUpdateStatus={updateStatus}
          />
        )}

        {user.role === "admin" && (
          <AdminView doctors={doctors} stats={stats} onDeleteDoctor={deleteDoctor} />
        )}
      </section>
    </main>
  );
}

function PatientView({
  appointments,
  booking,
  doctors,
  prescriptions,
  schedules,
  selectedDoctor,
  setBooking,
  onBook,
  onLoadSchedule,
  busy,
}) {
  const hasDoctors = doctors.length > 0;

  return (
    <>
      <section id="book" className="panel-grid">
        <article className="panel">
          <h2>Book appointment</h2>
          <form className="form compact" onSubmit={onBook}>
            <label>
              Doctor
              <select
                required
                disabled={!hasDoctors}
                value={booking.doctorId}
                onChange={(event) => setBooking({ ...booking, doctorId: event.target.value })}
              >
                {!hasDoctors && <option value="">No doctors available</option>}
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                ))}
              </select>
            </label>
            {!hasDoctors && (
              <p className="form-help">No doctor accounts are registered yet. Register one doctor account first, then refresh.</p>
            )}
            <label>
              Date
              <input
                required
                type="date"
                value={booking.date}
                onChange={(event) => setBooking({ ...booking, date: event.target.value })}
              />
            </label>
            <label>
              Slot
              <select value={booking.slot} onChange={(event) => setBooking({ ...booking, slot: event.target.value })}>
                {slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
              </select>
            </label>
            <button className="primary" disabled={!hasDoctors || busy}>Book now</button>
          </form>
        </article>

        <article className="panel">
          <h2>Doctor schedule</h2>
          <label className="field-only">
            Select doctor
            <select disabled={!hasDoctors} value={selectedDoctor} onChange={(event) => onLoadSchedule(event.target.value)}>
              <option value="">{hasDoctors ? "Choose a doctor" : "No doctors available"}</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
              ))}
            </select>
          </label>
          <div className="list">
            {schedules.length ? schedules.map((item) => (
              <div className="row" key={item._id}>
                <strong>{item.day}</strong>
                <span>{item.slots.join(", ")}</span>
              </div>
            )) : <p className="muted">No schedule loaded.</p>}
          </div>
        </article>
      </section>

      <AppointmentList appointments={appointments} title="My appointments" />
      <PrescriptionList prescriptions={prescriptions} />
    </>
  );
}

function DoctorView({
  appointments,
  prescription,
  schedule,
  setPrescription,
  setSchedule,
  onCreatePrescription,
  onCreateSchedule,
  onUpdateStatus,
}) {
  return (
    <>
      <section id="schedule" className="panel-grid">
        <article className="panel">
          <h2>Add schedule</h2>
          <form className="form compact" onSubmit={onCreateSchedule}>
            <label>
              Day
              <select value={schedule.day} onChange={(event) => setSchedule({ ...schedule, day: event.target.value })}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </label>
            <label>
              Slots
              <input
                required
                value={schedule.slots}
                onChange={(event) => setSchedule({ ...schedule, slots: event.target.value })}
                placeholder="09:00 AM, 11:00 AM"
              />
            </label>
            <button className="primary">Save schedule</button>
          </form>
        </article>

        <article className="panel">
          <h2>Create prescription</h2>
          <form className="form compact" onSubmit={onCreatePrescription}>
            <label>
              Appointment
              <select
                required
                value={prescription.appointmentId}
                onChange={(event) => {
                  const appointment = appointments.find((item) => item._id === event.target.value);
                  setPrescription({
                    ...prescription,
                    appointmentId: event.target.value,
                    patientId: appointment?.patient?._id || "",
                  });
                }}
              >
                <option value="">Choose appointment</option>
                {appointments.map((appointment) => (
                  <option key={appointment._id} value={appointment._id}>
                    {formatPerson(appointment.patient)} - {appointment.date}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Medicines
              <textarea
                required
                rows="4"
                value={prescription.medicines}
                onChange={(event) => setPrescription({ ...prescription, medicines: event.target.value })}
                placeholder="Paracetamol - twice daily"
              />
            </label>
            <label>
              Notes
              <textarea
                rows="3"
                value={prescription.notes}
                onChange={(event) => setPrescription({ ...prescription, notes: event.target.value })}
                placeholder="Clinical notes"
              />
            </label>
            <button className="primary">Create</button>
          </form>
        </article>
      </section>

      <AppointmentList appointments={appointments} title="Patient appointments" onUpdateStatus={onUpdateStatus} />
    </>
  );
}

function AdminView({ doctors, stats, onDeleteDoctor }) {
  return (
    <>
      <section className="metrics wide">
        <article>
          <span>{stats?.totalDoctors || 0}</span>
          <p>Total doctors</p>
        </article>
        <article>
          <span>{stats?.totalPatients || 0}</span>
          <p>Total patients</p>
        </article>
        <article>
          <span>{stats?.totalAppointments || 0}</span>
          <p>Total appointments</p>
        </article>
      </section>

      <section id="doctors" className="panel">
        <h2>Doctors</h2>
        <div className="table">
          {doctors.map((doctor) => (
            <div className="table-row" key={doctor._id}>
              <div>
                <strong>{doctor.name}</strong>
                <span>{doctor.email}</span>
              </div>
              <button className="danger" onClick={() => onDeleteDoctor(doctor._id)}>Remove</button>
            </div>
          ))}
          {!doctors.length && <p className="muted">No doctors registered.</p>}
        </div>
      </section>
    </>
  );
}

function AppointmentList({ appointments, title, onUpdateStatus }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="table">
        {appointments.map((appointment) => (
          <div className="table-row appointment" key={appointment._id}>
            <div>
              <strong>{formatPerson(appointment.doctor || appointment.patient)}</strong>
              <span>{appointment.date || "No date"} at {appointment.slot || "No slot"}</span>
            </div>
            <span className={`status ${appointment.status}`}>{appointment.status}</span>
            {onUpdateStatus && (
              <div className="actions">
                {["approved", "completed", "rejected"].map((status) => (
                  <button key={status} className="small" onClick={() => onUpdateStatus(appointment._id, status)}>
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {!appointments.length && <p className="muted">No appointments yet.</p>}
      </div>
    </section>
  );
}

function PrescriptionList({ prescriptions }) {
  return (
    <section className="panel">
      <h2>Prescriptions</h2>
      <div className="table">
        {prescriptions.map((prescription) => (
          <div className="table-row prescription" key={prescription._id}>
            <div>
              <strong>{formatPerson(prescription.doctor)}</strong>
              <span>{prescription.notes || "No notes added"}</span>
            </div>
            <ul>
              {prescription.medicines.map((medicine, index) => (
                <li key={`${medicine.name}-${index}`}>{medicine.name}: {medicine.dosage}</li>
              ))}
            </ul>
          </div>
        ))}
        {!prescriptions.length && <p className="muted">No prescriptions yet.</p>}
      </div>
    </section>
  );
}

export default App;
