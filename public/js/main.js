const buttons = document.querySelectorAll('.hex-btn');
const hexagons = document.querySelectorAll('.hexagon');
const explanations = document.querySelectorAll('.explanation');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    hexagons.forEach(h => h.classList.remove('active'));
    explanations.forEach(ex => ex.classList.remove('active'));

    const hex = btn.querySelector('.hexagon');
    const targetId = btn.getAttribute('data-target');
    const target = document.getElementById(targetId);

    hex.classList.add('active');
    target.classList.add('active');
  });
});
