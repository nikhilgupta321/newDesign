import React, { useContext, useEffect } from "react";
import PageTitle from "./PageTitle";
import { GlobalContext } from "../context/GlobalContext";

function htmlDecode(input) {
  var e = document.createElement("textarea");
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export default function ContactPage(props) {
  const { settings } = useContext(GlobalContext);

  useEffect(() => {
    document.title = "Contact Us | " + settings.websitename;
  }, [settings]);

  return (
    <b>
      <div className="flex flex-col gap-5">
        <PageTitle title="CONTACT US" />
        {/* <div>{settings.publication}</div> */}
        <div
          dangerouslySetInnerHTML={{
            __html:
              typeof window !== "undefined" ? htmlDecode(settings.address) : "",
          }}
        ></div>
        WhatsApp your query test 
        <br />
        <div>
          <div className="phoneno">
            <div>Phone:</div>
            <div className="text-blue-A" >{`${settings.whatsup_number}`}</div>
            <img
              className="whatsapp-icon"
              src="/assets/images/whatsapp-icon.png"
            />
          </div>
        </div>
      </div>
    </b>
  );
}