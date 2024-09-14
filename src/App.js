import { db } from "./firebase.config";
import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore";
import './App.css'
import myImage from '../Brown.jpg'; // Adjust path according to your directory structure

function App() {
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({
    collegeName: "",
    major: "",
    reasonsToGo: [],
    studentsKnown: []
  });

  const [popupActive, setPopupActive] = useState(false);

  const collegesCollectionRef = collection(db, "colleges");

  useEffect(() => {
    onSnapshot(collegesCollectionRef, snapshot => {
      setColleges(snapshot.docs.map(doc => ({
        id: doc.id,
        viewing: false,
        ...doc.data()
      })));
    });
  }, []);

  const handleView = id => {
    const collegesClone = [...colleges];

    collegesClone.forEach(college => {
      if (college.id === id) {
        college.viewing = !college.viewing;
      } else {
        college.viewing = false;
      }
    });

    setColleges(collegesClone);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (
      !form.collegeName ||
      !form.major
    ) {
      alert("Please fill out at least college name and major");
      return;
    }

    addDoc(collegesCollectionRef, form);

    setForm({
      collegeName: "",
      major: "",
      reasonsToGo: [],
      studentsKnown: []
    });

    setPopupActive(false);
  };

  const handleReasonsToGo = (e, i) => {
    const reasonsClone = [...form.reasonsToGo];

    reasonsClone[i] = e.target.value;

    setForm({
      ...form,
      reasonsToGo: reasonsClone
    });
  };

  const handleStudentsKnown = (e, i) => {
    const studentsClone = [...form.studentsKnown];

    studentsClone[i] = e.target.value;

    setForm({
      ...form,
      studentsKnown: studentsClone
    });
  };

  const handleReasonsToGoCount = () => {
    setForm({
      ...form,
      reasonsToGo: [...form.reasonsToGo, ""]
    });
  };

  const handleStudentsKnownCount = () => {
    setForm({
      ...form,
      studentsKnown: [...form.studentsKnown, ""]
    });
  };

  const removeCollege = id => {
    deleteDoc(doc(db, "colleges", id));
  };

  return (
    <div className="App">
      <h1>College Candidates List</h1>
      <img src={myImage} alt="Description of Image" className="my-image" />
      <button className="special" onClick={() => setPopupActive(!popupActive)}>
  Add College
</button>


      <div className="colleges">
        {colleges.map((college) => (
          <div className="college" key={college.id}>
            <h3>{college.collegeName}</h3>

            <p dangerouslySetInnerHTML={{ __html: college.major }}></p>

            {college.viewing && (
              <div>
                <h4>Reasons to Go</h4>
                <ul>
                  {college.reasonsToGo.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>

                <h4>Students Known</h4>
                <ol>
                  {college.studentsKnown.map((student, i) => (
                    <li key={i}>{student}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="buttons">
              <button onClick={() => handleView(college.id)}>
                View {college.viewing ? 'less' : 'info'}
              </button>
              <button className="remove" onClick={() => removeCollege(college.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {popupActive && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add a new college</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>College Name</label>
                <input
                  type="text"
                  value={form.collegeName}
                  onChange={e => setForm({ ...form, collegeName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Major</label>
                <textarea
                  value={form.major}
                  onChange={e => setForm({ ...form, major: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Reasons to Go</label>
                {form.reasonsToGo.map((reason, i) => (
                  <input
                    type="text"
                    key={i}
                    value={reason}
                    onChange={e => handleReasonsToGo(e, i)}
                  />
                ))}
                <button type="button" onClick={handleReasonsToGoCount}>
                  Add Reason
                </button>
              </div>

              <div className="form-group">
                <label>Students Known</label>
                {form.studentsKnown.map((student, i) => (
                  <textarea
                    type="text"
                    key={i}
                    value={student}
                    onChange={e => handleStudentsKnown(e, i)}
                  />
                ))}
                <button type="button" onClick={handleStudentsKnownCount}>
                  Add Student
                </button>
              </div>

              <div className="buttons">
                <button type="submit">Submit</button>
                <button type="button" className="remove" onClick={() => setPopupActive(false)}>
                  Close
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
