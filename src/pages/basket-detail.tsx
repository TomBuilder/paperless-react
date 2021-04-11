import * as React from 'react'
import { useParams } from "react-router-dom";
import DocumentList from '../components/document-list';
import PdfViewer from "../components/pdf-viewer";
import { Box } from '@material-ui/core';

type TParams = { id: string };

const BasketDetailPage = () => {
  const params: TParams = useParams();
  const [docid, setDocid] = React.useState('');

  const docidChanged = (docid: string) => {
    setDocid(docid);
    console.log(`Neue DocId: ${docid}`);
  }

  return (
    <Box display='flex'>
      <Box width='220px'>
        <DocumentList id={params.id} docidChanged={docidChanged}></DocumentList>
      </Box>
      <Box flexGrow='1'>
        <PdfViewer docid={docid} filename=''></PdfViewer>
      </Box>
    </Box>
  )
}

export default BasketDetailPage;
