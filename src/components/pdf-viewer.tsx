import * as React from 'react'
import axios from 'axios';
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer'

type TParams = { docid: string, filename: string };

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
        //docViewer.loadDocument('/files/pdftron_about.pdf');
        const response = await axios.get(`${process.env.REACT_APP_BASEURL}documents/${docid}/content`, { responseType: 'arraybuffer' })
        const blob = new Blob([response.data], { type: 'application/pdf' });
        instance.docViewer.loadDocument(blob, { extension: 'pdf' });
        instance.setHeaderItems(header => {
          header.delete('SaveOnApi');
          header.push({
            type: 'actionButton',
            img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            onClick: saveDocument,
            title: 'Speichern',
            dataElement: 'SaveOnApi'       
          });
        });
  }
    })()
  }, [docid]);

  async function saveDocument() {
    if (instance) {
      let data = new FormData();
      const doc = instance.docViewer.getDocument();
      const xfdfString = await instance.annotManager.exportAnnotations();
      const fileData = new Uint8Array(await doc.getFileData({ xfdfString }));
      const blob = new Blob([fileData], { type: 'application/pdf' });
      data.append('documentContent', blob, filename);
      await axios.put(`${process.env.REACT_APP_BASEURL}documents/${docid}/content`, data, { headers: { "Content-Type": "multipart/form-data" }, })
    }
  }

  return (
    <div>
      <div ref={viewer} style={{ height: '100vh', paddingTop: '8px', paddingBottom: '8px' }}></div>
    </div>
  )
}

export default PdfViewer;