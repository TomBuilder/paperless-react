import { useParams } from "react-router-dom";
import DocumentList from '../components/document-list';
import PdfViewer from "../components/pdf-viewer";
import { Box } from '@material-ui/core';

type TParams = { id: string };

const BasketDetailPage = () => {
  const params: TParams = useParams();

  return (
    <Box display='flex'>
      <Box width='220px'>
        <DocumentList id={params.id}></DocumentList>
      </Box>
      <Box flexGrow='1'>
        <PdfViewer></PdfViewer>
      </Box>
    </Box>
  )
}

export default BasketDetailPage;
