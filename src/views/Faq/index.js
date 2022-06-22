import React from "react";
import user from "../../assets/img/profile.svg";
import Header from "../Header";
import Card from "./card";

const Faq = () => {
  return (
    <React.Fragment>
      <Header></Header>
      <div className="container-fluid pt-4" style={{height:'100vh'}}>
        <div className="row justify-content-center">
          <Card title="COVID-19 Safety Measures"></Card>
          <Card title="Frequently asked questions"></Card>
          <Card title="Rent and deposit queries"></Card>
        </div>
        <div className="row justify-content-center">
          <Card title="Payment methods"></Card>
          <Card title="Colive handbook"></Card>
          <Card title="Feedback"></Card>
        </div>
      </div>
    </React.Fragment>
  )
};

export default Faq;
