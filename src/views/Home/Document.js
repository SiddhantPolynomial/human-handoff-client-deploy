import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
library.add(faFilePdf, faFileExcel);

const Document = (props) => {
    const { icon, fileType, fileName, openDoc } = props;
    return (
        <div className="document" onClick={openDoc}>
            <div className="thumbnail">
                {fileType}
            </div>
            <div className="description">
                <div className="icon">
                    <FontAwesomeIcon icon={["fa", icon]} />
                </div>
                <div className="text">
                    {fileName}
                </div>
            </div>
        </div>
    )
};

export default Document;