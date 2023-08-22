import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'reply-btn'){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
    else if(e.target.dataset.trashIcon){
        deleteTweet(e.target.dataset.trashIcon)
    }
    else if(e.target.dataset.trashIconReply){
        deleteReplyTweet(e.target.dataset.trashIconReply)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    renderReplyTrashIcon()
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    const tweetUuid = uuidv4()
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@User`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: tweetUuid
        })
    render()
    tweetInput.value = ''
    }
}

function handleReplyBtnClick(tweetId){
    const replyInput = document.querySelectorAll('#tweet-reply-input')
    const tweetReplyUuid = uuidv4()
    
    const targetTweetObject = tweetsData.filter(function(tweet) {
        return tweetId === tweet.uuid
    })[0]
    
    replyInput.forEach(function(reply){
        if(reply.value) {
            targetTweetObject.replies.push({
                handle: `@User`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: reply.value,
                uuid: tweetReplyUuid
            })
            render()
            handleReplyClick(tweetId)
            reply.value = ''
        }
    })
   
}

function renderTrashIcon(){
    const trashIcons = document.querySelectorAll(`#user-trash-icon`)
    
    trashIcons.forEach(function(icon){
        tweetsData.forEach(function(tweet){
            if (tweet.handle === '@User'){
                icon.classList.remove('hidden')
            }
        })
    })
    
}

function deleteTweet(tweetId){
    let count = 0;
    tweetsData.forEach(function(tweet) {
        if (tweet.uuid === tweetId){
            tweetsData.splice(count, 1)
        }
        count++
    })
    render()
}

function renderReplyTrashIcon(){
    const trashIconsReply = document.querySelectorAll(`#user-trash-icon-reply`)
    
    trashIconsReply.forEach(function(icon) {
        tweetsData.forEach(function(tweet) {
            tweet.replies.forEach(function(reply) {
                if (reply.handle === '@User'){
                    icon.classList.remove('hidden')
                }
            })
        })
    })
}

function deleteReplyTweet(tweetReplyId){
    let count = 0;
    let tweetId = ''
    
    tweetsData.forEach(function(tweet) {
        tweet.replies.forEach(function(reply) {
            if (reply.uuid === tweetReplyId) {
                tweetId = tweet.uuid
                tweet.replies.splice(count, 1)
            }
            count++
        })
        count = 0;
        
    })
    
    render()
    handleReplyClick(tweetId)
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <div class="tweet-handle-delete tweet-handle-delete-reply">
                    <p class="handle">${reply.handle}</p>
                    <span class="hidden" id="${reply.handle === '@User' ? 'user-trash-icon-reply' : 'trash-icon'}"><i class="fa-solid fa-trash hidden" data-trash-icon-reply="${reply.uuid}"></i></span>
                </div>
                <p class="tweet-text tweet-text-reply">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="tweet-handle-delete">
                <p class="handle">${tweet.handle}</p>
                <span class="hidden" id="${tweet.handle === '@User' ? 'user-trash-icon' : 'trash-icon'}"><i class="fa-solid fa-trash hidden" data-trash-icon="${tweet.uuid}"></i></span>
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <div class="reply-container">
            <div class="tweet-input-area tweet-reply-area">
                <img src="images/scrimbalogo.png" class="profile-pic">
                <textarea placeholder="Post your reply!" data-reply-="${tweet.uuid}" id="tweet-reply-input"></textarea>
            </div>
            <button id="reply-btn" data-reply-btn="${tweet.uuid}">Reply</button>
        </div>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    renderTrashIcon()
}

render()

