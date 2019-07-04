import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';

import './Feed.css';

import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

class Feed extends Component {
    state = {
        feed: [],
        isHidden: true
    };
    async componentDidMount(){
        this.registerToSocket();
        const response = await api.get('posts');

        this.setState({ feed: response.data });
    }

    registerToSocket = () => {
        const socket = io('http://localhost:3333');

        // post, like

        socket.on('post', newPost => {
            // alert('Novo POst');
            this.setState({ feed: [newPost, ...this.state.feed]});
        })

        socket.on('like', likedPost => {
            this.setState({
                feed: this.state.feed.map(post =>
                    post._id === likedPost._id ? likedPost : post 
                )
            });
        })
    }

    handleLike = id => {
        api.post(`/posts/${id}/like`);
    }
    // toggleHidden () {
    //     this.setState({
    //         isHidden: !this.state.isHidden
    //     })
    // }

    // newPost () {
    //     alert("função New POst")
    // }

    render(){
        return(
            <section id="post-list">
                {/* <div>
                    <button onClick={this.toggleHidden.bind(this)} >
                    Click to show modal
                    </button>
                    {!this.state.isHidden && <Child />}
                </div> */}
                { this.state.feed.map(post => (
                    <article key={post._id}>
                        <header>
                            <div className="user-info">
                                <span>{post.author}</span>
                                <span className="place">{post.place}</span>
                            </div>
                            <img src={more} alt="Mais"/>
                        </header>

                        <img src={`http://localhost:3333/files/${post.image}`} alt="Sas 2"/>

                        <footer>
                            <div className="actions">
                                <button type="button" onClick={() => this.handleLike(post._id)}>
                                    <img src={like} alt=""/>
                                </button>
                                <img src={comment} alt=""/>
                                <img src={send} alt=""/>
                            </div>

                            <strong>{post.likes} curtidas</strong>

                            <p>{post.description}
                                <span>{post.hashtags}</span>
                            </p>
                        </footer>
                    </article>
                ))}
            </section>
        );
    }
}
const Child = () => (
    <article id="new-post">
        <button type="button" id="close" >
            New Post
        </button>
    </article>
)

export default Feed;