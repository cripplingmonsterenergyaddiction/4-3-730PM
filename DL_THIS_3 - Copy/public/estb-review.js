// document.querySelectorAll(".post").forEach(post => {
// 	const postId = post.dataset.postId;
// 	const ratings = post.querySelectorAll(".post-rating");
// 	const likeRating = ratings[0];

// 	ratings.forEach(rating => {
// 		const button = rating.querySelector(".post-rating-button");
// 		const count = rating.querySelector(".post-rating-count");

// 		button.addEventListener("click", async () => {
// 			if (rating.classList.contains("post-rating-selected")) {
// 				return;
// 			}

// 			count.textContent = Number(count.textContent) + 1;

// 			ratings.forEach(rating => {
// 				if (rating.classList.contains("post-rating-selected")) {
// 					const count = rating.querySelector(".post-rating-count");

// 					count.textContent = Math.max(0, Number(count.textContent) - 1);
// 					rating.classList.remove("post-rating-selected");
// 				}
// 			});

// 			rating.classList.add("post-rating-selected");

// 			const likeOrDislike = likeRating === rating ? "like" : "dislike";
// 			const response = await fetch(`/posts/${postId}/${likeOrDislike}`);
// 			const body = await response.json();
// 		});
// 	});
// });

const showPopup = document.querySelector('.post-popup');
const popupContainer = document.querySelector('.post-popup-container');
const closePopup = document.querySelector('.post-popup-close-button');
const editPopup = document.querySelector('.edit-button')
const editPopupContainer = document.querySelector('.edit-popup-container');
const editClosePopup = document.querySelector('.edit-popup-close-button');
const editSavePopup = document.querySelector('.save-post-popup-edit');
const deletePopup = document.querySelector('.del-button')
const deletePopupContainer = document.querySelector('.delete-popup-container');
const deleteClosePopup = document.querySelector('.confirm-del-button'); 
const deleteCancelPopup = document.querySelector('.cancel-del-button');
const ownerReplyPopup = document.querySelector('.owner-reply-button');
const ownerPopupContainer = document.querySelector('.owner-reply-container');
const ownerClosePopup = document.querySelector('.owner-popup-close-button');
const ownerSavePopup = document.querySelector('.owner-save-post-popup');


showPopup.addEventListener('click', () => {
	popupContainer.showModal();
})

closePopup.addEventListener('click', () => {
	popupContainer.close();
})

editPopup.addEventListener('click', () => {
	editPopupContainer.showModal();
})

editClosePopup.addEventListener('click', () => {
	editPopupContainer.close();
})

editSavePopup.addEventListener('click', () => {
	editPopupContainer.close();
})

deletePopup.addEventListener('click', () => {
	deletePopupContainer.showModal();
})

deleteClosePopup.addEventListener('click', () => {
	deletePopupContainer.close();
})

deleteCancelPopup.addEventListener('click', () => {
	deletePopupContainer.close();
})

ownerReplyPopup.addEventListener('click', () => {
	ownerPopupContainer.showModal();
})

ownerClosePopup.addEventListener('click', () => {
	ownerPopupContainer.close();
})

ownerSavePopup.addEventListener('click', () => {
	ownerPopupContainer.close();
})


const editPopup2 = document.querySelector('.edit-button-2')
const editPopupContainer2 = document.querySelector('.edit-popup-container-2');
const editClosePopup2 = document.querySelector('.edit-popup-close-button-2');
const editSavePopup2 = document.querySelector('.edit-save-button-2');
const deletePopup2 = document.querySelector('.del-button-2')
const deletePopupContainer2 = document.querySelector('.delete-popup-container-2');
const deleteClosePopup2 = document.querySelector('.confirm-del-button-2'); 
const deleteCancelPopup2 = document.querySelector('.cancel-del-button-2'); 

editPopup2.addEventListener('click', () => {
	editPopupContainer2.showModal();
})

editClosePopup2.addEventListener('click', () => {
	editPopupContainer2.close();
})

editSavePopup2.addEventListener('click', () => {
	editPopupContainer2.close();
})

deletePopup2.addEventListener('click', () => {
	deletePopupContainer2.showModal();
})

deleteClosePopup2.addEventListener('click', () => {
	deletePopupContainer2.close();
})

deleteCancelPopup2.addEventListener('click', () => {
	deletePopupContainer2.close();
})


 // Select all elements with the "i" tag and store them in a NodeList called "stars"
 const stars = document.querySelectorAll(".stars i");

 const overallStar = document.querySelectorAll(".stars #overall");
 const serviceStar = document.querySelectorAll(".stars #service");
 const foodStar = document.querySelectorAll(".stars #food");
 const ambianceStar = document.querySelectorAll(".stars #ambiance");
//  // Loop through the "stars" NodeList
//  stars.forEach((star, index1) => {
//    // Add an event listener that runs a function when the "click" event is triggered
//    star.addEventListener("click", () => {
// 	 // Loop through the "stars" NodeList Again
// 	 stars.forEach((star, index2) => {
// 	   // Add the "active" class to the clicked star and any stars with a lower index
// 	   // and remove the "active" class from any stars with a higher index
// 	   index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
// 	 });
//    });
//  });

  // Loop through the "stars" NodeList
  overallStar.forEach((star, index1) => {
	// Add an event listener that runs a function when the "click" event is triggered
	star.addEventListener("click", () => {
	  // Loop through the "stars" NodeList Again
	  overallStar.forEach((star, index2) => {
		// Add the "active" class to the clicked star and any stars with a lower index
		// and remove the "active" class from any stars with a higher index
		index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
	  });
	});
  });

    // Loop through the "stars" NodeList
	serviceStar.forEach((star, index1) => {
		// Add an event listener that runs a function when the "click" event is triggered
		star.addEventListener("click", () => {
		  // Loop through the "stars" NodeList Again
		  serviceStar.forEach((star, index2) => {
			// Add the "active" class to the clicked star and any stars with a lower index
			// and remove the "active" class from any stars with a higher index
			index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
		  });
		});
	  });

	  foodStar.forEach((star, index1) => {
		// Add an event listener that runs a function when the "click" event is triggered
		star.addEventListener("click", () => {
		  // Loop through the "stars" NodeList Again
		  foodStar.forEach((star, index2) => {
			// Add the "active" class to the clicked star and any stars with a lower index
			// and remove the "active" class from any stars with a higher index
			index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
		  });
		});
	  });  

	  ambianceStar.forEach((star, index1) => {
		// Add an event listener that runs a function when the "click" event is triggered
		star.addEventListener("click", () => {
		  // Loop through the "stars" NodeList Again
		  ambianceStar.forEach((star, index2) => {
			// Add the "active" class to the clicked star and any stars with a lower index
			// and remove the "active" class from any stars with a higher index
			index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
		  });
		});
	  });