import React from "react";
import user from "../../assets/img/profile.svg";

const Card = (props) => {
  const { title } = props;
  return (
    <div className="col-lg-3 col-md-3 col-sm-12 shadow faq-card">
      <img src={user} alt="Card-icon" style={{ width: 55 }} />
      <h4 className="text-center">{title}</h4>
    </div>
  )
};

export default Card;
