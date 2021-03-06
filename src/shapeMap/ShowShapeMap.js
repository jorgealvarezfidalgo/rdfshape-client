import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import Alert from "react-bootstrap/Alert";

function showQualify(node, prefix) {

    const relativeBaseRegex = /^<internal:\/\/base\/(.*)>$/g;
    const matchBase = relativeBaseRegex.exec(node);
    if (matchBase) {
        const rawNode = matchBase[1];
        return "<" + rawNode + ">";
    } else {
        const iriRegexp = /^<(.*)>$/g;
        const matchIri = iriRegexp.exec(node);
        if (matchIri) {
            const rawNode = matchIri[1];
            for (const key in prefix) {
                if (rawNode.startsWith(prefix[key])) {
                    const localName = rawNode.slice(prefix[key].length);
                    const longNode = "<" + rawNode + ">";
                    return <abbr title={longNode + key}>{":" + localName}</abbr> ;
                }
            }
            return <a href={rawNode}>{"<" + rawNode + ">"}</a>;
        }
        if (node.match(/^[0-9"'_]/)) return node;
        console.error("Unknown format for node: " + node);
        return node;
    }
}

function shapeMap2Table(shapeMap, nodesPrefixMap, shapesPrefixMap) {
   return shapeMap.map((assoc,key) => ({
      'id': key,
      'node': showQualify(assoc.node, nodesPrefixMap),
      'shape': showQualify(assoc.shape, shapesPrefixMap),
      'status': assoc.status,
      'details': assoc.reason
    }))
}

function shapeFormatter(cell, row) {
    if (row.status ==='conformant') {
        return (<span style={ { color:'green'}}>{cell}</span> );
    } else
        return (<span style={ {color: 'red'}}>!{cell}</span> );
}

function detailsFormatter(cell, row) {
    return (
        <details>
         <p className="word-break">{row.details}</p>
        </details>
    );
}

function ShowShapeMap(props) {
    const shapeMap = props.shapeMap
    if (typeof shapeMap === 'string') {
       return <Alert variant="info">{shapeMap}</Alert>
    } else {
        const table = shapeMap2Table(shapeMap, props.nodesPrefixMap, props.shapesPrefixMap)
        const columns = [
            {
                dataField: 'id',
                text: "Id",
                sort: true
            },
            {
                dataField: 'node',
                text: "Node",
                sort: true
            },
            {
                dataField: 'shape',
                text: "Shape",
                sort: true,
                formatter: shapeFormatter
            },
            {
                dataField: 'status',
                hidden: true
            },
            {
                dataField: 'evidence',
                text: "Details",
                formatter: detailsFormatter
            },
        ];

        return <BootstrapTable
            keyField='id'
            data={table}
            columns={columns}
            striped
            hover
            condensed/>
    }
}

export default ShowShapeMap;
