import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import auth from "../../helper/auth-helper";
import { listAdminArchives, createIssue } from "../../helper/api-archives";
import { GlobalContext } from "../../context/GlobalContext";

const parseDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString();
};

export default function AdminArchives(props) {
  const { flash, setFlash } = useContext(GlobalContext);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [archives, setArchives] = useState([]);
  const [values, setValues] = useState({
    addNew: false,
    volume: "",
    issue: "",
  });

  const jwt = auth.isAuthenticated();

  const handleSubmit = () => {
    setIsSubmitted(true);

    if (!values.volume || !values.issue) {
      return;
    }

    const params = {
      volume: values.volume,
      issue: values.issue,
      year: new Date().getFullYear(),
    };

    createIssue({ token: jwt.token }, params).then((data) => {
      if (data.error) {
        setFlash({ error: true, msg: "Something went wrong" });
      } else {
        listAdminArchives({ token: jwt.token }).then((data) => {
          if (data && data.error) {
            setFlash({ error: true, msg: "Something went wrong" });
          } else {
            setValues({ addNew: false, volume: "", issue: "" });
            setIsSubmitted(false);
            setArchives(data);
            setFlash({ success: true, msg: "Issue created successfully" });
          }
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: "" });
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listAdminArchives({ token: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        console.error(data.error);
      } else {
        setArchives(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="w-24 p-1 bg-green-700 rounded text-slate-200"
          onClick={() => {
            setValues({ addNew: true });
          }}
        >
          Add New
        </button>
        {values.addNew && (
          <>
            <input
              className={`pl-4 rounded border-2 border-gray-400 ${isSubmitted && !values.volume ? "border-b-red-500" : ""
                } focus:outline-sky-600`}
              type="number"
              min="0"
              onChange={handleChange("volume")}
              value={values.volume || ""}
              placeholder="Volume"
            />
            <input
              className={`pl-4 rounded border-2 border-gray-400 ${isSubmitted && !values.issue ? "border-b-red-500" : ""
                }  focus:outline-sky-600`}
              type="number"
              min="0"
              onChange={handleChange("issue")}
              value={values.issue || ""}
              placeholder="Issue"
            />
            <button
              className="w-24 p-1 rounded bg-sky-600 text-slate-200"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="w-8 p-1 bg-red-400 rounded text-slate-200"
              type="button"
              onClick={() => {
                setValues({});
                setIsSubmitted(false);
              }}
            >
              X
            </button>
          </>
        )}
      </div>
      <div className="border-2 border-t-0 rounded border-slate-400">
        {archives.length !== 0 &&
          archives.map((issue, index) => {
            return (
              <Link
                key={`issue-${index + 1}`}
                className="flex flex-wrap gap-4 p-1 bg-white border-t-2 border-slate-400"
                to={`/admin/archives/${issue.year}/${issue.volume}/${issue.issue}`}
              >
                <div className="text-lg text-blue-600">{`${issue.year
                  }, VOLUME ${issue.volume.toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                  })}, ISSUE ${parseInt(issue.issue).toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                  })}`}</div>
                <div>_</div>
                <div className="text-lg text-red-600">{`[ ${issue.articles.toLocaleString(
                  "en-US",
                  { minimumIntegerDigits: 3, useGrouping: false }
                )} ]`}</div>
                <div>_</div>
                <div className="text-black">{parseDate(issue.creation)}</div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
