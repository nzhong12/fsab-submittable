import { db } from "./firebase.config";
import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import './App.css';
import './index.css';
import myImage from './Brown.jpg';

function App() {
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({
    collegeName: "",
    major: "",
    rank: "", 
    reasonsToGo: [],
    essay: ""
  });

  const [popupActive, setPopupActive] = useState(false);
  const [editMode, setEditMode] = useState(false); 
  const [currentCollegeId, setCurrentCollegeId] = useState(null); 

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.collegeName ||
      !form.major ||
      !form.rank 
    ) {
      alert("Please fill out at least college name, major, and your ranking of the school");
      return;
    }

    if (editMode && currentCollegeId) {
      // update existing college
      await updateDoc(doc(db, "colleges", currentCollegeId), form);
    } else {
      // new college
      await addDoc(collegesCollectionRef, form);
    }

    // reset form
    setForm({
      collegeName: "",
      major: "",
      rank: "", 
      reasonsToGo: [],
      essay: ""
    });

    setPopupActive(false);
    setEditMode(false); // reset edit mode
    setCurrentCollegeId(null); 
  };

  const handleReasonsToGo = (e, i) => {
    const reasonsClone = [...form.reasonsToGo];
    reasonsClone[i] = e.target.value;
    setForm({
      ...form,
      reasonsToGo: reasonsClone
    });
  };

  const handleReasonsToGoCount = () => {
    setForm({
      ...form,
      reasonsToGo: [...form.reasonsToGo, ""]
    });
  };

  const removeCollege = id => {
    deleteDoc(doc(db, "colleges", id));
  };

  const editCollege = college => {
    setForm({
      collegeName: college.collegeName,
      major: college.major,
      rank: college.rank, 
      reasonsToGo: college.reasonsToGo,
      essay: college.essay || "" // essay might not exist
    });
    setCurrentCollegeId(college.id);
    setEditMode(true);
    setPopupActive(true);
  };

  // sort colleges by user rank
  const sortedColleges = [...colleges].sort((a, b) => {
    return a.rank - b.rank;
  });

  return (
    <div className="App">
      <h1>College Candidates List</h1>
      <div className="header-container">
        <img src={myImage} alt="Description of Image" className="college-image" />
        <button className="special" onClick={() => setPopupActive(!popupActive)}>Add College</button>
      </div>

      <div className="colleges">
        {sortedColleges.map((college) => (
          <div className="college" key={college.id}>
            <h3>{college.collegeName}</h3>
            <p><strong>Major:</strong> {college.major}</p>
            <p><strong>Your Ranking:</strong> {college.rank}</p>

            {college.viewing && (
              <div>
                <h4>Reasons to Go</h4>
                <ul>
                  {college.reasonsToGo.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>

                <h4>Why Us Essay</h4>
                <p>{college.essay}</p>
              </div>
            )}

            <div className="buttons">
              <button onClick={() => handleView(college.id)}>
                View {college.viewing ? 'less' : 'Entry'}
              </button>
              <button className="remove" onClick={() => removeCollege(college.id)}>
                Remove Entry
              </button>
              <button className="edit" onClick={() => editCollege(college)}>
                Update Entry
              </button>
            </div>
          </div>
        ))}
      </div>

      {popupActive && (
        <div className="popup">
          <div className="popup-inner">
            <h2>{editMode ? "Edit College" : "Add a new college"}</h2>

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
                <label>Your Ranking</label>
                <input
                  type="number"
                  value={form.rank}
                  onChange={e => setForm({ ...form, rank: e.target.value })}
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
                <button type="button" className = "add-reason" onClick={handleReasonsToGoCount}>
                  Add Reason
                </button>
              </div>

              <div className="form-group">
                <label> Why Us Essay</label>
                <textarea
                  value={form.essay}
                  onChange={e => setForm({ ...form, essay: e.target.value })}
                />
              </div>

              <div className="buttons">
              <button type="submit" className="submitButton">{editMode ? "Update" : "Submit"}</button>
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
