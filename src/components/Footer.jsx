import React from "react";
import { MDBContainer } from "mdbreact";


const Footer = () => (

     <div className="footer-bottom">
     <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Tract: <a href="#"> Back to top </a>
        </MDBContainer>
      </div>
     </div>
);




export default Footer;
