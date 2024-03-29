// {
//     "by" : "norvig",
//     "id" : 2921983,
//     "kids" : [ 2922097, 2922429, 2924562, 2922709, 2922573, 2922140, 2922141 ],
//     "parent" : 2921506,
//     "text" : "Aw shucks, guys ... you make me blush with your compliments.<p>Tell you what, Ill make a deal: I'll keep writing if you keep reading. K?",
//     "time" : 1314211127,
//     "type" : "comment"
//   }

import React, { Component } from 'React';
import { Row, Alert, Spinner, Button } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

// TODO: Use a pure functional component if no state changes...
export default class HackerNewsComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            childCommentDetails: undefined,
            loading: false,
            error: undefined
        }
        this.loadChildCommentDetails = this.loadChildCommentDetails.bind(this);
        this.hackersNewsApiBaseUrl = 'https://hacker-news.firebaseio.com/v0';

    }

    loadChildCommentDetails() {
         // Make a call to get the next 30 news items using the appropriate item IDs

         // Set the state to be loading and show the spinner
         this.setState({
             loading: true
         })

         const childCommentDetailsCalls = [];
         for (let i = 0; i < this.props.commentDetails.kids.length; i++) {
             const currentChildCommentId = this.props.commentDetails.kids[i];
             console.info(`The currentChildCommentId about to have details requested is: ${currentChildCommentId}`);
             childCommentDetailsCalls.push(axios.get(`${this.hackersNewsApiBaseUrl}/item/${currentChildCommentId}.json`));
         }


         axios.all(childCommentDetailsCalls).then(childCommentDetailsResponses => {

             console.info(`The child comment details are: ${JSON.stringify(childCommentDetailsResponses)}`);

             // Iterate through responses, extracting out the data and assign these all to the state
             const childCommentDetailsData = [];
             childCommentDetailsResponses.forEach(currentChildCommentDetailsResponse => {
                childCommentDetailsData.push(currentChildCommentDetailsResponse.data)
             });


             this.setState({
                 childCommentDetails: childCommentDetailsData,
                 loading: false
             });
         }).catch(error => {

             console.error(`Something went wrong attempting to fetch the first 30 news item details: ${JSON.stringify(error)}`);

             // Set the error on the state and display it to the user in an alert
             this.setState({
                 error: error.message
             });
         });
    }

    render() {
        console.info(`In hacker news item, the props are: ${JSON.stringify(this.props)}`);

        const momentTimePosted = moment.unix(this.props.commentDetails.time).format('DD/MM/YYYY HH:mm');
        console.info(`The momentTimePosted (in hours): ${momentTimePosted}`);

        return (
            <Row className="hacker-news-comment__container">
                <span className="hacker-news-comment__text">{this.props.commentDetails.text}</span>
                <div className="hacker-new-comment__details">
                    <span className="hacker-news-comment__description">Posted by {this.props.commentDetails.by} at {momentTimePosted}</span>
                    {
                        this.state.error ?
                            <Alert variant="danger">
                                {`Something went wrong loading comments: ${this.state.error}`}
                            </Alert>
                            :
                            this.state.loading ?
                                <Row className="top-hacker-news-items__spinner">
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </Row>
                                :
                                this.state.childCommentDetails ?
                                    this.state.childCommentDetails.map(currentChildCommentDetails => {
                                        ;
                                        return (
                                        <HackerNewsComment commentDetails={currentChildCommentDetails} />
                                        )
                                    })
                                    :
                                    this.props.commentDetails.kids ?
                                        <Button size="sm" onClick={this.loadChildCommentDetails}>Load child comments...</Button>
                                        :
                                        null
                    }
                </div>
            </Row>
        );
    }
}
