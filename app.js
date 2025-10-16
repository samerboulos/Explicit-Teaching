// Scenarios data
const scenarios = [
  {
    id: 1,
    title: "Year 6 Visual Art lesson",
    content: `• Students are shown a range of five images and a list of ten descriptive words (translated into relevant languages).
• Appropriate time is given for students to look at and comment on each image and the teacher asks students to build on each other's ideas.
• The teacher reads through the list of descriptive words and explains each one.
• Students use a device with the text-to-talk function to match a descriptive word with an image.
• Students complete a pair-and-share activity (paired with a peer of like ability) to explain their choices.`,
    correctMatch: "Review prior learning - Example"
  },
  {
    id: 2,
    title: "Year 6 Visual Art lesson",
    content: `• Descriptive words are only provided in English.
• It is assumed all students understand the meaning of the descriptive words.
• Students all complete the task as a matching activity on a printout.
• Student pairings are random.`,
    correctMatch: "Review prior learning - Non-example"
  },
  {
    id: 3,
    title: "Year 10 Maths lesson",
    content: `• Teacher introduces and explains a complex algebraic concept.
• Teacher provides multiple illustrations of its practical application.
• Teacher works through a variety of examples, each increasing in complexity.
• Students use an online quiz on devices with relevant accessibility features to check for understanding.
• Teacher aide is observing and watching for student engagement and understanding.`,
    correctMatch: "Present new learning - Example"
  },
  {
    id: 4,
    title: "Year 10 Maths lesson",
    content: `• Students who have demonstrated a lower level of readiness for the new learning are taught separately by a teacher aide.
• These students are presented with different learning intentions and success criteria.`,
    correctMatch: "Present new learning - Non-example"
  },
  {
    id: 5,
    title: "Year 8 History lesson",
    content: `• Students watch a video (with captions) on a particular topic.
• Students are provided with a graphic organiser (digital or paper) that requires them to construct a timeline of events.
• The video is stopped at key points and students are asked a range of questions that increase in complexity to direct the construction of the timeline.
• Students add to the timeline in a way of their choosing (sentences, dot points, images).
• Students are invited to analyse the impact of each event on the next event and add this to their timeline as they are constructing it.`,
    correctMatch: "Guided practice - Example"
  },
  {
    id: 6,
    title: "Year 8 History lesson",
    content: `• After checking for understanding at the end of the guided practice, some students do not have the content knowledge to move to purposeful practice. All students are retaught the new content using different strategies.`,
    correctMatch: "Guided practice - Non-example"
  },
  {
    id: 7,
    title: "Year 9 Economics and Business/Commerce lesson",
    content: `• Teachers provide students with a range of resources exploring Australia's key trade routes (including digital) that include images, texts and video.
• Students identify key trade routes on a global map and explain and justify why they are important.`,
    correctMatch: "Purposeful practice - Example"
  },
  {
    id: 8,
    title: "Year 9 Economics and Business/Commerce lesson",
    content: `• Students are provided with a single resource exploring Australia's key trade routes.
• Students identify key trade routes on a global map and explain why they are important.`,
    correctMatch: "Purposeful practice - Non-example"
  },
  {
    id: 9,
    title: "Year 1 Drama lesson",
    content: `• Teacher revisits learning intentions and success criteria for the lesson.
• Teacher asks students what they learned about emotions in drama. Students are encouraged to build on each other's ideas.
• Students watch a short video. They draw/write/verbally respond to a question about the different emotions displayed in the video and explain and justify their thinking.
• Responses are collected.`,
    correctMatch: "Ongoing review of learning - Example"
  },
  {
    id: 10,
    title: "Year 1 Drama lesson",
    content: `• Teacher revisits learning intentions and success criteria for the lesson.
• Teacher gives students an exit ticket with a question that asks them to write one thing they have learned.
• Responses are collected.`,
    correctMatch: "Ongoing review of learning - Non-example"
  }
];

// Game state
let currentScenarioIndex = 0;
let availableScenarios = [...scenarios];
let matchedCount = 0;
let draggedScenario = null;

// DOM elements
const scenarioCard = document.getElementById('scenarioCard');
const scenarioNumber = document.getElementById('scenarioNumber');
const scenarioSubject = document.getElementById('scenarioSubject');
const scenarioContent = document.getElementById('scenarioContent');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const remainingCount = document.getElementById('remainingCount');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const completionModal = document.getElementById('completionModal');
const dropZones = document.querySelectorAll('.drop-zone');

// Shuffle scenarios function
function shuffleScenarios() {
  // Fisher-Yates shuffle algorithm
  const shuffled = [...scenarios];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Update available scenarios with shuffled order
  availableScenarios = shuffled.filter(scenario => 
    !document.querySelector(`[data-stage="${scenario.correctMatch}"] .matched-scenario`)
  );
  
  // Reset current scenario index
  currentScenarioIndex = 0;
  
  // Update displays
  updateScenarioDisplay();
  updateNavButtons();
}

// Initialize the game
function initGame() {
  shuffleScenarios();
  updateProgress();
  setupEventListeners();
}

// Update scenario display
function updateScenarioDisplay() {
  if (availableScenarios.length === 0) {
    scenarioCard.style.display = 'none';
    return;
  }
  
  const scenario = availableScenarios[currentScenarioIndex];
  scenarioNumber.textContent = `Scenario ${scenario.id}`;
  scenarioSubject.textContent = scenario.title;
  
  // Convert bullet points to HTML list
  const contentLines = scenario.content.split('\n').filter(line => line.trim());
  const listItems = contentLines.map(line => `<li>${line.replace('• ', '')}</li>`).join('');
  scenarioContent.innerHTML = `<ul>${listItems}</ul>`;
  
  // Update remaining count
  remainingCount.textContent = `${availableScenarios.length} scenario${availableScenarios.length !== 1 ? 's' : ''} remaining`;
}

// Update navigation buttons
function updateNavButtons() {
  prevBtn.disabled = currentScenarioIndex === 0;
  nextBtn.disabled = currentScenarioIndex >= availableScenarios.length - 1;
}

// Update progress
function updateProgress() {
  const progress = (matchedCount / 10) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${matchedCount}/10 matches completed`;
}

// Setup event listeners
function setupEventListeners() {
  // Navigation buttons
  prevBtn.addEventListener('click', () => {
    if (currentScenarioIndex > 0) {
      currentScenarioIndex--;
      updateScenarioDisplay();
      updateNavButtons();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentScenarioIndex < availableScenarios.length - 1) {
      currentScenarioIndex++;
      updateScenarioDisplay();
      updateNavButtons();
    }
  });
  
  // Shuffle button
  shuffleBtn.addEventListener('click', () => {
    shuffleScenarios();
  });
  
  // Drag and drop for scenario card
  scenarioCard.addEventListener('dragstart', handleDragStart);
  scenarioCard.addEventListener('dragend', handleDragEnd);
  
  // Touch support for mobile
  let isDragging = false;
  let dragStartX, dragStartY;
  
  scenarioCard.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
    scenarioCard.classList.add('dragging');
    draggedScenario = availableScenarios[currentScenarioIndex];
  });
  
  scenarioCard.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.drop-zone');
    
    // Clear all drag-over states
    dropZones.forEach(zone => zone.classList.remove('drag-over'));
    
    // Add drag-over to valid drop zone
    if (dropZone && !dropZone.querySelector('.matched-scenario')) {
      dropZone.classList.add('drag-over');
    }
  });
  
  scenarioCard.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    scenarioCard.classList.remove('dragging');
    
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.drop-zone');
    
    // Clear all drag-over states
    dropZones.forEach(zone => zone.classList.remove('drag-over'));
    
    if (dropZone && !dropZone.querySelector('.matched-scenario')) {
      handleDrop(dropZone);
    }
    
    draggedScenario = null;
  });
  
  // Drop zone events
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      handleDrop(zone);
    });
    zone.addEventListener('dragleave', handleDragLeave);
  });
}

// Drag event handlers
function handleDragStart(e) {
  draggedScenario = availableScenarios[currentScenarioIndex];
  scenarioCard.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  scenarioCard.classList.remove('dragging');
  dropZones.forEach(zone => zone.classList.remove('drag-over'));
}

function handleDragOver(e) {
  e.preventDefault();
  if (!this.querySelector('.matched-scenario')) {
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
  }
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(dropZone) {
  dropZone.classList.remove('drag-over');
  
  if (!draggedScenario || dropZone.querySelector('.matched-scenario')) {
    return;
  }
  
  const dropZoneStage = dropZone.dataset.stage;
  const isCorrectMatch = draggedScenario.correctMatch === dropZoneStage;
  
  if (isCorrectMatch) {
    // Correct match
    handleCorrectMatch(dropZone, draggedScenario);
  } else {
    // Incorrect match
    handleIncorrectMatch(dropZone);
  }
}

// Handle correct match
function handleCorrectMatch(dropZone, scenario) {
  // Visual feedback
  dropZone.classList.add('correct-match');
  
  // Create matched scenario element
  const matchedElement = document.createElement('div');
  matchedElement.className = 'matched-scenario';
  matchedElement.innerHTML = `
    <div class="scenario-number">Scenario ${scenario.id}</div>
    <div class="scenario-subject">${scenario.title}</div>
    <div class="scenario-content">${scenario.content.split('\n')[0].replace('• ', '')}</div>
  `;
  
  // Replace empty state with matched scenario
  const dropZoneContent = dropZone.querySelector('.drop-zone-content');
  dropZoneContent.innerHTML = '';
  dropZoneContent.appendChild(matchedElement);
  
  // Remove scenario from available scenarios
  availableScenarios = availableScenarios.filter(s => s.id !== scenario.id);
  
  // Update current scenario index if needed
  if (currentScenarioIndex >= availableScenarios.length) {
    currentScenarioIndex = Math.max(0, availableScenarios.length - 1);
  }
  
  // If no more scenarios available, hide the shuffle button
  if (availableScenarios.length === 0) {
    shuffleBtn.style.display = 'none';
  }
  
  // Update match count
  matchedCount++;
  
  // Update displays
  updateScenarioDisplay();
  updateNavButtons();
  updateProgress();
  
  // Check for completion
  if (matchedCount === 10) {
    setTimeout(() => {
      showCompletionModal();
    }, 500);
  }
}

// Handle incorrect match
function handleIncorrectMatch(dropZone) {
  dropZone.classList.add('incorrect-match');
  
  setTimeout(() => {
    dropZone.classList.remove('incorrect-match');
  }, 500);
}

// Show completion modal
function showCompletionModal() {
  completionModal.classList.add('show');
}

// Reset game (for Play Again functionality)
function resetGame() {
  // Clear all matched scenarios from drop zones
  dropZones.forEach(zone => {
    zone.classList.remove('correct-match');
    const content = zone.querySelector('.drop-zone-content');
    content.innerHTML = '<div class="empty-state">Drop scenario here</div>';
  });
  
  // Reset game state
  currentScenarioIndex = 0;
  availableScenarios = [...scenarios];
  matchedCount = 0;
  draggedScenario = null;
  
  // Show shuffle button again
  shuffleBtn.style.display = 'flex';
  
  // Hide completion modal
  completionModal.classList.remove('show');
  
  // Shuffle and update displays
  shuffleScenarios();
  updateProgress();
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', initGame);