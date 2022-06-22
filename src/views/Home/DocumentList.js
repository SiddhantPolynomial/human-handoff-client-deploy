import React, { useState}from 'react';
import Document from './Document';
import { Modal } from 'react-responsive-modal';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
library.add(faSearch);

const DocumentList = (props) => {

    const [openDocument, setOpenDocument] = useState(false);

    const openDoc = () => setOpenDocument(true);
    const closeDoc = () => setOpenDocument(false);
    return (
        <React.Fragment>
            <div className="search-box">
                <FontAwesomeIcon icon={["fa", "search"]} />
                <input type="text" name="search" placeholder="Type in to search document" />
            </div>
            <div className="document-container">
                <div className="row">
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-pdf" fileType="pdf" fileName="File Name.pdf"></Document>
                    </div>
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-excel" fileType="Xlsx" fileName="Sheet Name.xlsx"></Document>
                    </div>
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-excel" fileType="Xlsx" fileName="Sheet Name.xlsx"></Document>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-pdf" fileType="pdf" fileName="File Name.pdf"></Document>
                    </div>
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-excel" fileType="Xlsx" fileName="Sheet Name.xlsx"></Document>
                    </div>
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-excel" fileType="Xlsx" fileName="Sheet Name.xlsx"></Document>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-pdf" fileType="pdf" fileName="File Name.pdf"></Document>
                    </div>
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-excel" fileType="Xlsx" fileName="Sheet Name.xlsx"></Document>
                    </div>
                    <div className="col-md-4">
                        <Document openDoc={openDoc} icon="file-excel" fileType="Xlsx" fileName="Sheet Name.xlsx"></Document>
                    </div>
                </div>
            </div>
            <Modal open={openDocument} onClose={closeDoc} closeOnEsc={true} closeOnOverlayClick={false} showCloseIcon={true} center>
                <div className="p-3">
                    <h4 className="text-center">Invoice</h4>
                    <div className="document-body">
                        <img src="https://coliveshona.blob.core.windows.net/uploadfiles/screenshot_invoiceberry_invoice_template_4.jpg" alt="Invoice" />
                    </div>
                    <div className="p-2 d-flex justify-content-between">
                        {/* <button className="btn btn-custom btn-capsule flex-1 ml-1 mr-1" onClick={closeDoc}>Close</button> */}
                    </div>
                </div>

            </Modal>
        </React.Fragment>
    )
};

export default DocumentList;