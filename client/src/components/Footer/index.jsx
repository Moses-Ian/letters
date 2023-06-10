import React from "react";
import hadas from "../../assets/images/hadas.jpg";
import david from "../../assets/images/david.jpg";
import ian from "../../assets/images/ian.jpg";
import chris from "../../assets/images/chris.jpg";

const Footer = () => {
  return (
    <div className="footer has-text-centered">
      <div className="names is-flex is-justify-content-center	is-align-items-center">
        <p className="creators">Created by</p>
        <div className="name-background">
          <a
            href="https://github.com/Moses-Ian/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={ian} alt="Ian Moses" />
          </a>
        </div>
        <div className="name-background">
          <a
            href="https://github.com/hadasss/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={hadas} alt="Hadas Kamin" />
          </a>
        </div>
        <div className="name-background">
          <a
            href="https://github.com/CWMasters/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={chris} alt="Chris Masters" />
          </a>
        </div>
        <div className="name-background">
          <a
            href="https://github.com/DavidTJGriffin/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={david} alt="David Griffin" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
