import React from 'react';
import Code from '../components/Code';
import { mkMode } from "../utils/Utils";
import Alert from 'react-bootstrap/Alert';
import {Permalink} from "../Permalink";

function ResultDataInfo(props) {
    const result = props.result;
    let msg = null;
    if (result) {
        const mode = mkMode(result.dataFormat);
        console.log(`Mode: ${mode}`);
        if (result.error) {
            msg = <Alert variant='danger'>{result.error}</Alert>
        }
        else if (result.msg && result.msg.toLowerCase().startsWith("error")){
                msg = <Alert variant='danger'>{result.msg}</Alert>
        } else {
            msg = <div>
                <Alert variant='success'>{result.msg}</Alert>
                {result.data && result.dataFormat && (
                    <Code
                        value={result.data}
                        mode={mode}
                        readOnly={true}
                        onChange={() => {}}
                        fromParams={props.fromParams}
                        resetFromParams={props.resetFromParams}
                    />
                )}
                <br/>
                <ul>
                    <li>Number of statements: {result.numberStatements}</li>
                    <li>DataFormat: <span>{result.dataFormat}</span></li>
                </ul>
                <details>
                    <pre>{JSON.stringify(result)}</pre>
                </details>
                { props.permalink && <Permalink url={props.permalink} /> }
            </div>
        }
        return (
            <div>
                {msg}
            </div>
        );
    }
}


export default ResultDataInfo;
