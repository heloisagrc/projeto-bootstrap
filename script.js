// feedback.js

const validateInput = (name, comment) => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{1,50}$/; // Permite letras com acentos
  const commentRegex = /^.{1,500}$/; // Até 500 caracteres
  return nameRegex.test(name) && commentRegex.test(comment);
};

const sendFeedback = async (name, comment, rating) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name, comment, rating });
    }, 500);
  });
};

const displayFeedbacks = (feedbacks) => {
  const feedbacksContainer = document.querySelector('.feedback-list');
  feedbacksContainer.innerHTML = ''; // Limpa a lista antes de exibir
  feedbacks.forEach((feedback) => {
    const feedbackItem = document.createElement('div');
    feedbackItem.classList.add('feedback-item');
    feedbackItem.innerHTML = `<strong>${feedback.name}</strong><p>${feedback.comment}</p><p>Avaliação: ${'★'.repeat(feedback.rating)}</p>`;
    feedbacksContainer.prepend(feedbackItem);
  });
};

const loadFeedbacks = () => {
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
  displayFeedbacks(feedbacks);
};

document.getElementById('feedback-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const comment = document.getElementById('comment').value.trim();
  
  // Verificação das estrelas
  const ratings = [...document.querySelectorAll('.rating')];
  const ratingsArray = ratings.map(r => {
    return Array.from(r.querySelectorAll('.star')).filter(star => star.classList.contains('selected')).length;
  });

  const averageRating = ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length;

  if (name === '' || comment === '' || averageRating === 0) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if (validateInput(name, comment)) {
    try {
      const feedback = await sendFeedback(name, comment, averageRating);
      
      // Salvar feedback no localStorage
      const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
      feedbacks.push(feedback);
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

      displayFeedbacks(feedbacks);
      document.getElementById('name').value = '';
      document.getElementById('comment').value = '';
      ratings.forEach(r => r.querySelectorAll('.star').forEach(star => star.classList.remove('selected'))); // Limpar estrelas
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    }
  } else {
    alert('Por favor, preencha os campos corretamente.');
  }
});

// Avaliação das estrelas
const categories = document.querySelectorAll('.rating');
categories.forEach((category) => {
  const stars = category.querySelectorAll('.star');

  stars.forEach((star) => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.getAttribute('data-value'));
      stars.forEach((s) => s.classList.remove('selected'));
      for (let i = 0; i < rating; i++) {
        stars[i].classList.add('selected');
      }
    });

    star.addEventListener('mouseover', function() {
      const rating = parseInt(this.getAttribute('data-value'));
      stars.forEach((s) => s.classList.remove('hover'));
      for (let i = 0; i < rating; i++) {
        stars[i].classList.add('hover');
      }
    });

    star.addEventListener('mouseout', function() {
      stars.forEach((s) => s.classList.remove('hover'));
    });
  });
});

// Carregar feedbacks ao inicializar a página
loadFeedbacks();
