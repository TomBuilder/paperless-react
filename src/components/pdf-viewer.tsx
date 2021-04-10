import * as React from 'react'
import WebViewer from '@pdftron/webviewer'

const PdfViewer = () => {
  const viewer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (viewer && viewer.current) {
      WebViewer(
        {
          path: '/webviewer/lib',
          initialDoc: '/files/pdftron_about.pdf',
        },
        viewer.current,
      ).then((instance) => {
        const { docViewer } = instance;
        // you can now call WebViewer APIs here...
      });
    }
  }, []);


  return (
    <div className="MyComponent">
       <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
    </div>)
}

export default PdfViewer;