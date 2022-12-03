import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import buildspaceLogo from "../assets/buildspace-logo.png";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputs, setInputs] = useState({});
  const [relationshipType, setRelationshipType] = useState("");
  const [formFields, setFormFields] = useState([
    {
      name: "",
      age: "",
      gender: "",
      smoker: "",
      pets: "",
      kids: "",
      pregnant: "",
      occupation: "",
      jobTitle: "",
      income: "",
      employer: "",
    },
  ]);

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(inputs);
    callGenerateEndpoint();
  };

  const addFields = () => {
    let object = {
      name: "",
      age: "",
      gender: "",
      smoker: "",
      pets: "",
      kids: "",
      pregnant: "",
      occupation: "",
      jobTitle: "",
      income: "",
      employer: "",
    };

    setFormFields([...formFields, object]);
  };

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  const tenantGroup = {
    tenantDetails: formFields,
    tenantRelationship: relationshipType,
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tenantGroup: tenantGroup }),
    });

    const data = await response.json();
    const { output, prompt } = data;
    console.log("OpenAI replied...", output?.text ? output.text : data);

    setApiOutput(`${output?.text ? output.text : data}`);
    console.log("Prompt was:", prompt);
    setIsGenerating(false);
  };

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const onRelationshipTypeChange = (event) => {
    console.log(event.target.value);
    setRelationshipType(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Offer Letter Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>convince your new landlord that you're the one to pick!</h2>
          </div>
        </div>
        <div className="App">
          <form onSubmit={handleSubmit} color="white">
            {formFields.map((form, index) => {
              return (
                <div key={index}>
                  <h3>Tenant {index + 1}</h3>
                  <div>
                    <label>
                      Enter your name:
                      <input
                        type="text"
                        name="name"
                        value={form.name || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Enter your age:
                      <input
                        type="number"
                        name="age"
                        value={form.age || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Select your gender:
                      <select
                        name="gender"
                        value={form.gender || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        <option></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Non-binary</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Are you a smoker?
                      <select
                        name="smoker"
                        value={form.smoker || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        <option></option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      How many pets do you have?
                      <input
                        type="number"
                        name="pets"
                        value={form.pets || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      How many kids do you have?
                      <input
                        type="number"
                        name="kids"
                        value={form.kids || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Are you pregnant?
                      <select
                        name="pregnant"
                        value={form.pregnant || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        <option></option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Select your occupation:
                      <select
                        name="occupation"
                        value={form.occupation || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      >
                        <option></option>
                        <option value="student">Student</option>
                        <option value="employed">Employed</option>
                        <option value="unemployed">Unemployed</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Enter your job title (or N/A if you don't have one):
                      <input
                        type="text"
                        name="jobTitle"
                        value={form.jobTitle || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Enter your income:
                      <input
                        type="number"
                        name="income"
                        value={form.income || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Enter your employer name:
                      <input
                        type="text"
                        name="employer"
                        value={form.employer || ""}
                        onChange={(event) => handleFormChange(event, index)}
                      />
                    </label>
                  </div>
                  <button onClick={() => removeFields(index)}>Remove</button>
                </div>
              );
            })}
          </form>
          <br />
          <button onClick={addFields}>Add Another Tenant..</button>
          <br />
          <br />
          {Object.keys(formFields).length > 1 && (
            <div className="relationship-dropdown">
              <label>
                <b>How do you know each other?</b>
                <select onChange={onRelationshipTypeChange}>
                  <option value="professional sharers">
                    Professional Sharers
                  </option>
                  <option value="students">Students</option>
                  <option value="platonic friends (not in a relationship)">
                    Friends
                  </option>
                  <option value="siblings">Siblings</option>
                  <option value="cousins">Cousins</option>
                  <option value="in a relationship">In a Relationship</option>
                  <option value="married">Married</option>
                </select>
              </label>
            </div>
          )}
          <br />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
        </div>
        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{apiOutput}</p>
            </div>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;

// create form
// form should ask for all data points
// should have an Add Tenant button that inserts another form
// inputs from all tenants should be saved in tenantGroup object
