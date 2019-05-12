
const theme = {
	width: "400px",
	height: "640px",
	pink: "#FF717D",
	blue: "#3FD1CB"
};

const addElement = (tag, id, html) => {
	var e = document.createElement(tag);
	e.innerHTML = html;
	e.setAttribute("id", id);
	document.body.appendChild(e);
}

const removeElement = id => {
	var e = document.getElementById(id);
	e.parentNode.removeChild(e);
}

const handleNumber = n => Math.round(n * 100) / 100;

const style = `
<style>
	#extz {
		all: initial;
	}

	#extz * {
		all: unset;
	}

	#extz {
		position: absolute;
		top: 15px;
		right: 120px;
		width: ${theme.width};
    height: ${theme.height};
		border-radius: 5px;
    background: white;
    background: linear-gradient(to right, #3FD1CB, #3498DB);
		box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index:2000000000000;
  }
  
  #extz .overlay {
    width: 380px;
    height: 620px;
    background: rgba(256, 256, 256, 0.8);
    display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index:2000000000001;
  }

	#extz h1 {
		font-size: 18px;
    color: rgba(0, 0, 0, 0.6);
  }
  
  #extz h1.title {
    font-size: 20px;
    margin-bottom: 12px;
  }

  #extz h1.title span {
    color: ${theme.blue};
  }

  #extz h1.score {
    font-size: 16px;
  }

  #extz h1.score span {
    color: ${theme.pink};
    font-weight: bold;
    font-size: 24px;
  }

	#extz h1 span {
		color: #555;
  }
  
  #extz p span.highlight {
    color: ${theme.pink};
    font-weight: bold;
  }

  #extz p span.blue {
    color: ${theme.blue};
  }

	#extz p {
		font-size: 14px;
		color: #555;
		margin: 0;
  }
  
  #extz p.sub {
    opacity: 0.5;
    margin-bottom: 5px;
  }

	#extz p span {
		pacity: 0.7;
	}

	#extz h2 {
		font-size: 16px;
		color: #555;
		margin: 15px 0 6px;
  }
  
  #extz h2.sec {
    margin: 20px 0 8px; 
  }

  #extz .overlay .tweets {
    max-height: 300px;
    width: 260px;
    border-radius: 5px;
    background: rgba(256, 256, 256, 0.7);
    overflow-y: scroll;
    z-index: 2000000000010;
    margin: 8px 0 15px;
    padding: 20px 10px;
    box-sizing: border-box;
  }

  #extz .overlay .tweets .tweet {
    display: block;
    margin-bottom: 24px;
  }

  #extz .overlay .tweets .tweet .user {
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    align-items: center;
    margin-bottom: 10px;
  }

  #extz .overlay .tweets .tweet .user img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 8px;
  }

  #extz .overlay .tweets .tweet .user .name {
    text-decoration: none;
    margin-right: 6px;
    font-size: 13px;
    color: #555;
    cursor: pointer;
  }

  #extz .overlay .tweets .tweet .user .location {
    opacity: 0.6;
    font-size: 12px;
  }

  #extz .overlay .tweets .content {
    display: flex;
    flex-direction: column;
  }

  #extz .overlay .tweets .content .text {
    font-size: 14px;
  }

  #extz .overlay .tweets .content .stats {
    font-size: 12px;
    margin-top: 6px;
    opacity: 0.7;
  }

  #extz .overlay .tweets .content .stats span {
    color: ${theme.blue};
  }

  #extz .tweets > p {
    height: 600px;
  }

  #extz .overlay .close-tag {
    position: absolute;
    top: 20px;
    right: 20px;
    transform: rotate(45deg);
    font-size: 24px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  #extz .overlay .close-tag:hover {
    transform: scale(1.1) rotate(45deg);
  }

	#extz .keywords {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	#extz .keywords > p {
		color: #555;
		font-size: 13px;
		border: 1px solid ${theme.blue};
		padding: 3px 10px;
		margin: 1.5px 6px;
		border-radius: 3px;
  }

  #extz h4 {
    font-weight: normal;
    color: rgba(0, 0, 0, .6);
  }
  
  .highlight {
    color: ${theme.pink};
    font-weight: bold;
  }
</style>
`;

document.addEventListener("copy", () => {
	const id = "popup";
	if (document.getElementById(id)) {
		return;
	}

	const loading = `
		<style>
			#loading {
				position: absolute;
				top: 15px;
				right: 120px;
				width: ${theme.width};
				height: ${theme.height};
				border-radius: 5px;
				background: white;
				box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				z-index: 1000000000000;
			}

			#loading img {
				width: 160;
				height: 160px;
			}
		</style>
		<div id="loading">
			<img src="https://loading.io/spinners/disqus/lg.discuss-messesage-preloader.gif" />
		</div>
	`;

	addElement("div", "lpopup", loading);

	fetch(`http://localhost:3000/twitter?url=${encodeURI(window.location.href)}`, { mode: "cors" })
		.then(res => res.json())
		.then(data => {
			console.log(data);

			const html = `
				${style}
				<div id="extz">
					<div class="overlay">
						<p class="close-tag" onClick="document.getElementById('lpopup').parentNode.removeChild(document.getElementById('lpopup'));document.getElementById('${id}').parentNode.removeChild(document.getElementById('${id}'));">＋</p>
						<h1 class="title">Before you <span>paste</span> it somewhere...<h1>
						<h1 class="score">Positivity: <span>${handleNumber(data.sd.avg)}</span> / 5.0</h1>
						<p class="sub">(with ${handleNumber(data.sd.stdDev)} <span>STD</span>)</p>
						<p><span class="highlight">${data.sd.neg}</span> negative v.s. <span class="blue">${data.sd.pos}</span> positive discussions </p>
						
						<h2 class="sec">Popular Tweets</h2>
						<div class="tweets">
						${data.topTweets.map(tweet => `
							<div class="tweet">
							<div class="user">
								<img src="${tweet.user.pic}" />
								<a href="https://twitter.com/${tweet.user.name}" target="_blank" class="name">@${tweet.user.name}</p>
								<p class="location"><span>|</span> ${tweet.user.location}</p>
							</div>
							<div class="content">
								<p class="text">${tweet.text}</p>
								<p class="stats"><span>${tweet.likes}</span> likes | <span>${tweet.rts}</span> retweets</p>
							</div>
							</div>
						`).join("")}
						</div>
						<h4>Are you still sure about spreading this?</h4>
						<p style="display: block; text-align: center;" onClick="document.getElementById('lpopup').parentNode.removeChild(document.getElementById('lpopup'));document.getElementById('${id}').parentNode.removeChild(document.getElementById('${id}'));">close</p>
					</div>
				</div>
			`;

			addElement("div", id, html);
		})
	}
);

/*
document.addEventListener("click", () => {
	chrome.runtime.sendMessage({
		text: "hello"
	});
});
*/

/*

*/