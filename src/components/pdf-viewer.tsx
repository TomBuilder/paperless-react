import * as React from 'react'
import axios from 'axios';
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer'

type TParams = { docid: string, filename: string };
const url = 'https://localhost:5001/';

const PdfViewer = ({ docid, filename }: TParams) => {

  const viewer = React.useRef<HTMLDivElement>(null);
  const [instance, setInstance] = React.useState<WebViewerInstance | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      if (instance === undefined) {
        if (viewer && viewer.current) {
          const newInstance = await WebViewer(
            {
              path: '/webviewer/lib',
            },
            viewer.current,
          )
          if (newInstance) {
            setInstance(newInstance);
          }
        }
      } else {
        const {docViewer} = instance;
        //docViewer.loadDocument('/files/pdftron_about.pdf');
        const response = await axios.get(`${url}documents/${docid}/content`, { responseType: 'arraybuffer' })
        const blob = new Blob([response.data], { type: 'application/pdf' });
        docViewer.loadDocument(blob);
     }
    })()
  }, [docid]);


  return (
    <div>
      <div ref={viewer} style={{ height: '100vh', paddingTop: '8px', paddingBottom: '8px' }}></div>
    </div>
  )
}

export default PdfViewer;