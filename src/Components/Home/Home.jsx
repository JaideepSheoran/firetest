import './Home.css';
import Post from '../Post/Post';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../Helper/Firebase';
import { query, collection, getDocs} from 'firebase/firestore';

function Home({setUsername}) {
	const [postsData, setPostsData] = useState([]);
	const [ok, setOK] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!window.sessionStorage.getItem('user')) {
			navigate('/login');
			return;
		}

		const dataQuery = query(
			collection(database, 'post')
		);
		getDocs(dataQuery).then((data) => {
			var posts = [];
			data.docs.forEach((doc) => {
				var pData = doc.data();
				pData['postID'] = doc.id;
				posts.push(pData);
			})
			setPostsData(posts);
			setOK(true);
		});

	}, []);


	return (
		ok
			?
			<>
				<div className='home-container'>					
					{
						postsData.map((post) => {
							return <Post key={post.postID} postID={post.postID} setUsername={setUsername} post={{
								user: post.username,
								title: post.caption,
								tags: post.tags,
								url: post.url,
								likesCnt: post.likesCnt
							}} />
						})
					}
				</div>
			</>
			:
			<>
				<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: '20%' }} className="fa-3x">
					<i className="fa-solid fa-cog fa-spin"></i>
				</div>
			</>
	)
}

export default Home;