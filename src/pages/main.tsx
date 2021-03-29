import * as React from 'react';
import axios from 'axios';
import Mailbox from '../components/mailbox';

enum PostboxType {
  General = 0,
  Input = 1,
  Personal = 2,
  Confidential = 3
}

type PostboxItem = {
  id: string,
  name: string,
  type: PostboxType,
  description: string,
  lastAccess: Date,
  lastUser: string,
  docCount: number
}

const MainPage: React.FC = () => {
  const [postboxes, setPostboxes] = React.useState<PostboxItem[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const url = 'https://localhost:5001/';

  const getAllPostboxes = async () => {
    const response = await axios.get(`${url}postboxes`)
    setPostboxes(response.data);
    setLoaded(true);
  }

  React.useEffect(() => {
    getAllPostboxes();
    console.log('load');

  }, []);

  if (loaded) {
    return (
      <div>
        {
          postboxes.map((postBoxItem: PostboxItem) =>
            <Mailbox
              key={postBoxItem.id}
              id={postBoxItem.id}
              title={postBoxItem.name}
              descripton={postBoxItem.description}
              waitingDocs={postBoxItem.docCount}
              lastAccess={new Date(postBoxItem.lastAccess)} />)
        }
      </div>
    );
  } else {
    return (
      <h1>Daten werden geladen...</h1>
    )
  }
};
export default MainPage;
