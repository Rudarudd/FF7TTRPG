// Global resource variables – starting with 25 HP and 10 MP
let max_hp = 25, current_hp = 25;
let max_mp = 10, current_mp = 10;
let max_stamina = 100, current_stamina = 100;
let max_atb = 100, current_atb = 0;

// Global stat variables – all start at 1
let stat_str = 1, stat_vit = 1, stat_dex = 1, stat_mag = 1, stat_wil = 1, stat_spr = 1, stat_lck = 1;
let level = 1, exp = 1, movement = 1;

// UI elements for resource tracker (created in createResourceUI)
let maxHpInput, setMaxHpButton, maxMpInput, setMaxMpButton;
let maxStaminaInput, setMaxStaminaButton, maxAtbInput, setMaxAtbButton;
let hpPlus, hpMinus, mpPlus, mpMinus, staminaPlus, staminaMinus, atbPlus, atbMinus;
let resetButton;
let staminaAtbLink = false, staminaAtbLinkButton;
let cnv;
let modalDiv = null; // For talents modals

// Global container variables (set in setup)
let resourceUIContainer;
let skillsContainer;

// For description modals
let descriptionModal = null;

// For linking stats to skills
let statLabelElements = {};
let attributeCheckboxes = {};
let statLinkMapping = {};
let attributeLinkMapping = {};
// For talents
let talents = []; // Array to store talent objects

const statDescriptions = {
  "STR": "Affects melee and ranged physical rolls (1d12 + STR vs DEF).",
  "VIT": "Increases HP (+5 HP per point).",
  "DEX": "Determines dodge rolls (1d12 + DEX to evade).",
  "MAG": "Affects magical attack rolls (1d12 + MAG vs MDEF).",
  "WIL": "Increases MP (+5 MP per point).",
  "SPR": "Determines magic evasion (1d12 + SPR to evade magic attacks).",
  "LCK": "Modifies loot rolls, critical hits, and grants rerolls (1 per 5 LCK).",
  "Level": "Character Level.",
  "EXP": "Experience Points (EXP) accumulated; formula for next level is TBD.",
  "Movement": "Determines movement range per turn."
};

const additionalAttributes = [
  { name: "Athletics", desc: "Your ability to exert physical strength and endurance to overcome obstacles. Used for climbing, swimming, jumping, grappling, and feats of raw power.", color: "#C0392B" },
  { name: "Endurance", desc: "Your capacity to withstand physical strain, pain, and adverse conditions. Used for resisting poisons, disease, exhaustion, and enduring extreme conditions.", color: "#27AE60" },
  { name: "Agility", desc: "Your speed, reflexes, and balance in movement and precision. Used for dodging, acrobatics, stealth, and precise motor control.", color: "#2980B9" },
  { name: "Willpower", desc: "Your mental resilience and determination to resist external influences. Used for resisting mind control, fear effects, psychic attacks, and maintaining focus under pressure.", color: "#FF69B4" },
  { name: "Awareness", desc: "Your ability to observe, sense, and interpret your surroundings. Used for noticing hidden details, tracking, detecting lies, and reacting to environmental threats.", color: "#F39C12" },
  { name: "Influence", desc: "Your ability to manipulate, persuade, or command others through words and body language. Friendly Influence is used for persuasion, bartering, and diplomacy; Hostile Influence is used for intimidation and coercion.", color: "#8E44AD" },
  { name: "Ingenuity", desc: "Your problem-solving ability and technical expertise in mechanical, electronic, and creative fields. Used for hacking, crafting, repairing technology, and improvising solutions.", color: "#2C3E50" }
];

// Default talents (for reset)
const defaultTalents = [
  { name: "Relentless Fighter", level: "I", category: "Physical Combat", description: "Recover 5 Stamina per turn.", maxLevel: "II" },
  { name: "Relentless Fighter", level: "II", category: "Physical Combat", description: "Recover 10 Stamina per turn.", maxLevel: "II" },
  { name: "Heavy Hitter", level: "I", category: "Physical Combat", description: "Gain +2 melee damage on critical hits.", maxLevel: "III" },
  { name: "Heavy Hitter", level: "II", category: "Physical Combat", description: "Gain +4 melee damage on critical hits.", maxLevel: "III" },
  { name: "Heavy Hitter", level: "III", category: "Physical Combat", description: "Gain +6 melee damage on critical hits.", maxLevel: "III" },
  { name: "Quick Reflexes", level: "I", category: "Physical Combat", description: "Dodging costs 20 Stamina instead of 25.", maxLevel: "III" },
  { name: "Quick Reflexes", level: "II", category: "Physical Combat", description: "Dodging costs 15 Stamina instead of 25.", maxLevel: "III" },
  { name: "Quick Reflexes", level: "III", category: "Physical Combat", description: "Dodging costs 10 Stamina instead of 25.", maxLevel: "III" },
  { name: "Enduring Block", level: "I", category: "Physical Combat", description: "If you fully block an attack, you recover 10 Stamina.", maxLevel: "III" },
  { name: "Enduring Block", level: "II", category: "Physical Combat", description: "If you fully block an attack, you recover 15 Stamina.", maxLevel: "III" },
  { name: "Enduring Block", level: "III", category: "Physical Combat", description: "If you fully block an attack, you recover 20 Stamina.", maxLevel: "III" },
  { name: "Battlefield Awareness", level: "I", category: "Physical Combat", description: "When an enemy misses you, gain 5 ATB.", maxLevel: "III" },
  { name: "Battlefield Awareness", level: "II", category: "Physical Combat", description: "When an enemy misses you, gain 10 ATB.", maxLevel: "III" },
  { name: "Battlefield Awareness", level: "III", category: "Physical Combat", description: "When an enemy misses you, gain 15 ATB.", maxLevel: "III" },
  { name: "Tactical Step", level: "I", category: "Physical Combat", description: "Moving an extra 10 ft per turn is free.", maxLevel: "II" },
  { name: "Tactical Step", level: "II", category: "Physical Combat", description: "Moving an extra 20 ft per turn is free.", maxLevel: "II" },
  { name: "Momentum Strike", level: "I", category: "Physical Combat", description: "If you move at least 15 ft before attacking, your attack deals +2 damage.", maxLevel: "I" },
  { name: "Shatter Guard", level: "I", category: "Physical Combat", description: "If an enemy is blocking, your attack ignores 2 DEF.", maxLevel: "I" },
  { name: "Grappling Mastery", level: "I", category: "Physical Combat", description: "Gain Advantage on all Grapple attempts.", maxLevel: "I" },
  
  { name: "Efficient Spellcasting", level: "I", category: "Magical", description: "Materia spells cost -5 MP (minimum 1MP cost per spell).", maxLevel: "III" },
  { name: "Efficient Spellcasting", level: "II", category: "Magical", description: "Materia spells cost -10 MP (minimum 1MP cost per spell).", maxLevel: "III" },
  { name: "Efficient Spellcasting", level: "III", category: "Magical", description: "Materia spells cost -15 MP (minimum 1MP cost per spell).", maxLevel: "III" },
  { name: "Arcane Conductor", level: "I", category: "Magical", description: "If you evade a magic attack, regain 5 MP.", maxLevel: "II" },
  { name: "Arcane Conductor", level: "II", category: "Magical", description: "If you evade a magic attack, regain 10 MP.", maxLevel: "II" },
  { name: "Elemental Mastery", level: "I", category: "Magical", description: "Choose one element; spells of that type deal +2 damage.", maxLevel: "II" },
  { name: "Elemental Mastery", level: "II", category: "Magical", description: "Choose one element; spells of that type deal +4 damage.", maxLevel: "II" },
  { name: "Mana Reservoir", level: "I", category: "Magical", description: "Max MP is increased by 5.", maxLevel: "II" },
  { name: "Mana Reservoir", level: "II", category: "Magical", description: "Max MP is increased by 10.", maxLevel: "II" },
  { name: "Overcharged Spellcasting", level: "I", category: "Magical", description: "If you spend double MP on a spell, its damage increases by +50%.", maxLevel: "I" },
  { name: "Dual Weave", level: "I", category: "Magical", description: "If you cast a spell, you may spend 25 ATB to cast a second spell as a bonus effect (must be a different spell).", maxLevel: "II" },
  { name: "Dual Weave", level: "II", category: "Magical", description: "If you cast a spell, you may spend 50 ATB to cast a second spell as a bonus effect (must be a different spell).", maxLevel: "II" },
  { name: "Weave Momentum", level: "I", category: "Magical", description: "If you cast a spell, your next attack deals +2 damage.", maxLevel: "I" },
  
  { name: "Sharpshooter", level: "I", category: "Ranged Combat", description: "Gain +1 damage on ranged attacks.", maxLevel: "III" },
  { name: "Sharpshooter", level: "II", category: "Ranged Combat", description: "Gain +2 damage on ranged attacks.", maxLevel: "III" },
  { name: "Sharpshooter", level: "III", category: "Ranged Combat", description: "Gain +3 damage on ranged attacks.", maxLevel: "III" },
  { name: "Cover Fire", level: "I", category: "Ranged Combat", description: "If an ally within 30 ft is attacked, you may spend 25 ATB to make a reaction shot at the attacker.", maxLevel: "I" },
  { name: "Eagle Eye", level: "I", category: "Ranged Combat", description: "Ignore half cover when making ranged attacks.", maxLevel: "I" },
  { name: "Deadly Precision", level: "I", category: "Ranged Combat", description: "When making a ranged attack, you may spend 10 ATB to increase your crit range by 1.", maxLevel: "III" },
  { name: "Deadly Precision", level: "II", category: "Ranged Combat", description: "When making a ranged attack, you may spend 20 ATB to increase your crit range by 2.", maxLevel: "III" },
  { name: "Deadly Precision", level: "III", category: "Ranged Combat", description: "When making a ranged attack, you may spend 30 ATB to increase your crit range by 3.", maxLevel: "III" },
  
  { name: "Guardian’s Oath", level: "I", category: "Defensive", description: "When you block for an ally, gain +2 to your Block Roll.", maxLevel: "III" },
  { name: "Guardian’s Oath", level: "II", category: "Defensive", description: "When you block for an ally, gain +4 to your Block Roll.", maxLevel: "III" },
  { name: "Guardian’s Oath", level: "III", category: "Defensive", description: "When you block for an ally, gain +6 to your Block Roll.", maxLevel: "III" },
  { name: "Armor Mastery", level: "I", category: "Defensive", description: "Wearing Heavy Armor increases movement speed by 5 ft.", maxLevel: "III" },
  { name: "Armor Mastery", level: "II", category: "Defensive", description: "Wearing Heavy Armor increases movement speed by 10 ft.", maxLevel: "III" },
  { name: "Armor Mastery", level: "III", category: "Defensive", description: "Wearing Heavy Armor increases movement speed by 15 ft.", maxLevel: "III" },
  { name: "Defensive Momentum", level: "I", category: "Defensive", description: "After blocking an attack, your next dodge roll gains Advantage.", maxLevel: "I" },
  { name: "Reactive Parry", level: "I", category: "Defensive", description: "If an enemy attacks you in melee, you may spend 25 ATB to counterattack.", maxLevel: "I" },
  { name: "Iron Will", level: "I", category: "Defensive", description: "Start encounters with an additional 25 stamina.", maxLevel: "I" },
  { name: "Stalwart Wall", level: "I", category: "Defensive", description: "If you don’t move on your turn, you gain +2 DEF for 1 round.", maxLevel: "I" },
  
  { name: "Tactician’s Instinct", level: "I", category: "Utility & Tactical", description: "Gain Advantage on Awareness rolls, and once per combat, you may reroll Initiative.", maxLevel: "II" },
  { name: "Tactician’s Instinct", level: "II", category: "Utility & Tactical", description: "Gain Advantage on Awareness rolls, and once per combat, you may reroll Initiative.", maxLevel: "II" },
  { name: "Quick Hands", level: "I", category: "Utility & Tactical", description: "Using items costs half Stamina.", maxLevel: "I" },
  { name: "Battle Medic", level: "I", category: "Utility & Tactical", description: "Healing grants an additional 2d4 HP.", maxLevel: "III" },
  { name: "Battle Medic", level: "II", category: "Utility & Tactical", description: "Healing grants an additional 2d6 HP.", maxLevel: "III" },
  { name: "Battle Medic", level: "III", category: "Utility & Tactical", description: "Healing grants an additional 2d8 HP.", maxLevel: "III" },
  { name: "Adrenaline Boost", level: "I", category: "Utility & Tactical", description: "When below half HP, immediately gain 25 Stamina.", maxLevel: "I" },
  { name: "Improvised Combatant", level: "I", category: "Utility & Tactical", description: "Gain Advantage when using the environment for attacks (throwing objects, knocking down obstacles).", maxLevel: "I" },
  { name: "Rushdown", level: "I", category: "Utility & Tactical", description: "Gain +5 ATB if you move at least 20 ft before attacking.", maxLevel: "II" },
  { name: "Rushdown", level: "II", category: "Utility & Tactical", description: "Gain +10 ATB if you move at least 20 ft before attacking.", maxLevel: "II" },
  { name: "Support Specialist", level: "I", category: "Utility & Tactical", description: "When assisting an ally, they gain +5 ATB.", maxLevel: "II" },
  { name: "Support Specialist", level: "II", category: "Utility & Tactical", description: "When assisting an ally, they gain +10 ATB.", maxLevel: "II" },
  { name: "Unbreakable Focus", level: "I", category: "Utility & Tactical", description: "Once per encounter, you may reroll a status effect affecting you.", maxLevel: "I" }
];

// Working copy of talents
let existingTalents = [...defaultTalents];

// For traits
let traits = []; // Array to store selected traits

// Default traits (sample list based on FF7 TTRPG flavor)
const defaultTraits = [
  { name: "Mako Infusion", level: "I", category: "Physical", description: "Gain +2 HP per turn.", maxLevel: "III" },
  { name: "Mako Infusion", level: "II", category: "Physical", description: "Gain +4 HP per turn.", maxLevel: "III" },
  { name: "Mako Infusion", level: "III", category: "Physical", description: "Gain +6 HP per turn.", maxLevel: "III" },
  { name: "SOLDIER Training", level: "I", category: "Combat", description: "Increase melee damage by +1.", maxLevel: "II" },
  { name: "SOLDIER Training", level: "II", category: "Combat", description: "Increase melee damage by +2.", maxLevel: "II" },
  { name: "Shinra Tech Savvy", level: "I", category: "Utility", description: "Gain Advantage on tech-related Ingenuity rolls.", maxLevel: "I" },
  { name: "Materia Affinity", level: "I", category: "Magical", description: "Reduce MP cost of spells by 2.", maxLevel: "III" },
  { name: "Materia Affinity", level: "II", category: "Magical", description: "Reduce MP cost of spells by 4.", maxLevel: "III" },
  { name: "Materia Affinity", level: "III", category: "Magical", description: "Reduce MP cost of spells by 6.", maxLevel: "III" },
  { name: "Cetra Heritage", level: "I", category: "Spiritual", description: "Gain +1 to SPR rolls.", maxLevel: "II" },
  { name: "Cetra Heritage", level: "II", category: "Spiritual", description: "Gain +2 to SPR rolls.", maxLevel: "II" }
];

// Working copy of traits
let existingTraits = [...defaultTraits];

function setup() {
  let resourceBarsContainer = select("#resource-bars");
  let resourceControlsContainer = select("#resource-controls");

  let containerWidth = resourceBarsContainer.elt.clientWidth;
  let canvasWidth = min(containerWidth, 600);
  let canvasHeight = 150;
  cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.parent(resourceBarsContainer);
  textFont("Arial");
  textSize(16);
  textAlign(LEFT, TOP);

  resourceUIContainer = createDiv();
  resourceUIContainer.parent(resourceControlsContainer);
  resourceUIContainer.id("resourceUIContainer");

  skillsContainer = createDiv();
  skillsContainer.id("skillsContainer");

  createResourceUI();
  createStatsUI();
  createTalentsUI();
  createTraitsUI(); // Added Traits initialization

  const tablinks = document.querySelectorAll('.tablink');
  const tabcontents = document.querySelectorAll('.tabcontent');
  tablinks.forEach(btn => {
    btn.addEventListener('click', () => {
      tablinks.forEach(b => b.classList.remove('active'));
      tabcontents.forEach(tc => tc.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    });
  });
}

function windowResized() {
  let resourceBarsContainer = select("#resource-bars");
  let containerWidth = resourceBarsContainer.elt.clientWidth;
  let canvasWidth = min(containerWidth, 600);
  resizeCanvas(canvasWidth, 150); // Match canvasHeight from setup()
}
function windowResized() {
  let contentDiv = select(".content");
  let contentWidth = contentDiv.elt.offsetWidth - 20;
  let contentHeight = contentDiv.elt.offsetHeight - 20;
  let canvasWidth = min(contentWidth, 600);
  let canvasHeight = min(contentHeight, windowHeight * 0.3, canvasWidth * 0.75);
  resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
  background(255);
  displayBars();
}

function displayBars() {
  background(255);
  
  let bar_width = width * 0.6;
  let bar_height = 20;
  let x = width * 0.1;
  let y_hp = 25, y_mp = 55, y_stamina = 85, y_atb = 115; // Original positions
  
  // HP Bar
  stroke(0);
  fill(128);
  rect(x, y_hp, bar_width, bar_height);
  noStroke();
  fill(255, 0, 0);
  let hp_width = (current_hp / max_hp) * bar_width;
  rect(x, y_hp, hp_width, bar_height);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255);
  textSize(16);
  text(`HP: ${current_hp}/${max_hp}`, x + bar_width / 2, y_hp + bar_height / 2);
  
  // MP Bar
  stroke(0);
  fill(128);
  rect(x, y_mp, bar_width, bar_height);
  noStroke();
  fill(128, 0, 128);
  let mp_width = (current_mp / max_mp) * bar_width;
  rect(x, y_mp, mp_width, bar_height);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255);
  textSize(16);
  text(`MP: ${current_mp}/${max_mp}`, x + bar_width / 2, y_mp + bar_height / 2);
  
  // Stamina Bar
  stroke(0);
  fill(128);
  rect(x, y_stamina, bar_width, bar_height);
  noStroke();
  fill(0, 150, 0);
  let stamina_width = (current_stamina / max_stamina) * bar_width;
  rect(x, y_stamina, stamina_width, bar_height);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255);
  textSize(16);
  text(`STMN: ${current_stamina}/${max_stamina}`, x + bar_width / 2, y_stamina + bar_height / 2);
  
  // ATB Bar
  stroke(0);
  fill(128);
  rect(x, y_atb, bar_width, bar_height);
  noStroke();
  fill(0, 0, 255);
  let atb_width = (current_atb / max_atb) * bar_width;
  rect(x, y_atb, atb_width, bar_height);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255);
  textSize(16);
  text(`ATB: ${current_atb}/${max_atb}`, x + bar_width / 2, y_atb + bar_height / 2);
}

function createResourceUI() {
  let rUI = resourceUIContainer;
  rUI.html("");

  // HP Row
  let hpRow = createDiv();
  hpRow.parent(rUI);
  hpRow.class("resource-row");
  let hpLabel = createSpan("HP:");
  hpLabel.parent(hpRow);
  maxHpInput = createInput(max_hp.toString(), "number");
  maxHpInput.parent(hpRow);
  maxHpInput.class("resource-input");
  setMaxHpButton = createButton("Set Max");
  setMaxHpButton.parent(hpRow);
  setMaxHpButton.class("resource-button");
  setMaxHpButton.mousePressed(setMaxHp);
  hpPlus = createButton("+10");
  hpPlus.parent(hpRow);
  hpPlus.class("resource-button small-button");
  hpPlus.mousePressed(() => { current_hp = min(current_hp + 10, max_hp); });
  hpMinus = createButton("-10");
  hpMinus.parent(hpRow);
  hpMinus.class("resource-button small-button");
  hpMinus.mousePressed(() => { current_hp = max(current_hp - 10, 0); });

  // MP Row
  let mpRow = createDiv();
  mpRow.parent(rUI);
  mpRow.class("resource-row");
  let mpLabel = createSpan("MP:");
  mpLabel.parent(mpRow);
  maxMpInput = createInput(max_mp.toString(), "number");
  maxMpInput.parent(mpRow);
  maxMpInput.class("resource-input");
  setMaxMpButton = createButton("Set Max");
  setMaxMpButton.parent(mpRow);
  setMaxMpButton.class("resource-button");
  setMaxMpButton.mousePressed(setMaxMp);
  mpPlus = createButton("+5");
  mpPlus.parent(mpRow);
  mpPlus.class("resource-button small-button");
  mpPlus.mousePressed(() => { current_mp = min(current_mp + 5, max_mp); });
  mpMinus = createButton("-5");
  mpMinus.parent(mpRow);
  mpMinus.class("resource-button small-button");
  mpMinus.mousePressed(() => { current_mp = max(current_mp - 5, 0); });

  // Stamina Row
  let staminaRow = createDiv();
  staminaRow.parent(rUI);
  staminaRow.class("resource-row");
  let staminaLabel = createSpan("Stamina:");
  staminaLabel.parent(staminaRow);
  maxStaminaInput = createInput(max_stamina.toString(), "number");
  maxStaminaInput.parent(staminaRow);
  maxStaminaInput.class("resource-input");
  setMaxStaminaButton = createButton("Set Max");
  setMaxStaminaButton.parent(staminaRow);
  setMaxStaminaButton.class("resource-button");
  setMaxStaminaButton.mousePressed(setMaxStamina);
  staminaPlus = createButton("+25");
  staminaPlus.parent(staminaRow);
  staminaPlus.class("resource-button small-button");
  staminaPlus.mousePressed(() => { current_stamina = min(current_stamina + 25, max_stamina); });
  staminaMinus = createButton("-25");
  staminaMinus.parent(staminaRow);
  staminaMinus.class("resource-button small-button");
  staminaMinus.mousePressed(() => {
    current_stamina = max(current_stamina - 25, 0);
    if (staminaAtbLink) { current_atb = min(current_atb + 25, max_atb); }
  });

  // ATB Row
  let atbRow = createDiv();
  atbRow.parent(rUI);
  atbRow.class("resource-row");
  let atbLabel = createSpan("ATB:");
  atbLabel.parent(atbRow);
  maxAtbInput = createInput(max_atb.toString(), "number");
  maxAtbInput.parent(atbRow);
  maxAtbInput.class("resource-input");
  setMaxAtbButton = createButton("Set Max");
  setMaxAtbButton.parent(atbRow);
  setMaxAtbButton.class("resource-button");
  setMaxAtbButton.mousePressed(setMaxAtb);
  atbPlus = createButton("+25");
  atbPlus.parent(atbRow);
  atbPlus.class("resource-button small-button");
  atbPlus.mousePressed(() => { current_atb = min(current_atb + 25, max_atb); });
  atbMinus = createButton("-50");
  atbMinus.parent(atbRow);
  atbMinus.class("resource-button small-button");
  atbMinus.mousePressed(() => { current_atb = max(current_atb - 50, 0); });

  // Stamina-ATB Link Row
  let linkRow = createDiv();
  linkRow.parent(rUI);
  linkRow.class("resource-row");
  staminaAtbLinkButton = createButton(staminaAtbLink ? "Link: ON" : "Link: OFF");
  staminaAtbLinkButton.parent(linkRow);
  staminaAtbLinkButton.class("resource-button");
  staminaAtbLinkButton.mousePressed(toggleStaminaAtbLink);
  staminaAtbLinkButton.style("background-color", staminaAtbLink ? "green" : "red");
  let linkDesc = createSpan("When ON, using STMN adds to ATB");
  linkDesc.parent(linkRow);

  // Reset Row
  let resetRow = createDiv();
  resetRow.parent(rUI);
  resetRow.class("resource-row");
  resetButton = createButton("Reset All");
  resetButton.parent(resetRow);
  resetButton.class("resource-button");
  resetButton.mousePressed(resetResources);
}

// Supporting functions (updated to include toggle)
function setMaxHp() {
  let value = parseInt(maxHpInput.value());
  if (!isNaN(value) && value > 0) { max_hp = value; current_hp = value; }
}

function setMaxMp() {
  let value = parseInt(maxMpInput.value());
  if (!isNaN(value) && value > 0) { max_mp = value; current_mp = value; }
}

function setMaxStamina() {
  let value = parseInt(maxStaminaInput.value());
  if (!isNaN(value) && value > 0) { max_stamina = value; current_stamina = value; }
}

function setMaxAtb() {
  let value = parseInt(maxAtbInput.value());
  if (!isNaN(value) && value > 0) { max_atb = value; current_atb = value; }
}

function resetResources() {
  current_hp = max_hp;
  current_mp = max_mp;
  current_stamina = max_stamina;
  current_atb = 0;
}

function toggleStaminaAtbLink() {
  staminaAtbLink = !staminaAtbLink;
  staminaAtbLinkButton.html(staminaAtbLink ? "Link: ON" : "Link: OFF");
  staminaAtbLinkButton.style("background-color", staminaAtbLink ? "green" : "red");
}

function toggleStaminaAtbLink() {
  staminaAtbLink = !staminaAtbLink;
  if (staminaAtbLink) {
    staminaAtbLinkButton.html("Link: ON");
    staminaAtbLinkButton.style("background-color", "green");
  } else {
    staminaAtbLinkButton.html("Link: OFF");
    staminaAtbLinkButton.style("background-color", "red");
  }
}

function createStatsUI() {
  let statsContainer = select("#stats");
  statsContainer.html("");
  
  // Header
  createElement("h2", "Stats").parent(statsContainer);
  
  // Description right after header
  let statsDesc = createP("Stats determine your character’s core abilities. Click a stat name for details.");
  statsDesc.parent(statsContainer);
  statsDesc.style("font-size", "12px");
  statsDesc.style("color", "#666");
  statsDesc.style("margin-top", "5px");
  statsDesc.style("margin-bottom", "10px");
  
  // Stats inputs
  createStatInput("Level", "Level", level, statsContainer, (val) => { level = val; }, false);
  createStatInput("EXP", "EXP", exp, statsContainer, (val) => { exp = val; }, false);
  createStatInput("Movement", "Movement", movement, statsContainer, (val) => { movement = val; }, false);
  
  createStatInput("STR", "Strength", stat_str, statsContainer, (val) => { stat_str = val; }, true);
  createStatInput("VIT", "Vitality", stat_vit, statsContainer, (val) => { stat_vit = val; updateResourcesBasedOnStats(); }, true);
  createStatInput("DEX", "Dexterity", stat_dex, statsContainer, (val) => { stat_dex = val; }, true);
  createStatInput("MAG", "Magic", stat_mag, statsContainer, (val) => { stat_mag = val; }, true);
  createStatInput("WIL", "Willpower", stat_wil, statsContainer, (val) => { stat_wil = val; updateResourcesBasedOnStats(); }, true);
  createStatInput("SPR", "Spirit", stat_spr, statsContainer, (val) => { stat_spr = val; }, true);
  createStatInput("LCK", "Luck", stat_lck, statsContainer, (val) => { stat_lck = val; }, true, true);
  
  createAdditionalAttributesUI();
}

function createStatInput(abbrev, name, initialValue, container, callback, linkable, greyOutAtMax = false) {
  let div = createDiv();
  div.parent(container);
  div.style("margin", "5px");
  
  let label = createSpan(name + " (" + abbrev + "): ");
  label.parent(div);
  label.style("cursor", "pointer");
  label.mouseClicked(() => {
    if (!descriptionModal) 
      showStatDescription(name + " (" + abbrev + ")", statDescriptions[abbrev] || "No description available.");
  });
  statLabelElements[abbrev] = label;
  
  let input = createInput(initialValue.toString(), "number");
  input.parent(div);
  input.style("width", "50px");
  input.changed(() => {
    let val = int(input.value());
    val = constrain(val, 1, 99);
    input.value(val);
    callback(val);
    if (greyOutAtMax && val === 99) {
      input.attribute("disabled", "true");
      input.style("background-color", "#ccc");
    } else if (greyOutAtMax) {
      input.removeAttribute("disabled");
      input.style("background-color", "white");
    }
  });
}

function createAdditionalAttributesUI() {
  let statsContainer = select("#stats");
  skillsContainer.parent(statsContainer);
  
  skillsContainer.style("padding", "5px");
  skillsContainer.style("margin-top", "20px");
  skillsContainer.style("width", "100%");
  skillsContainer.style("max-width", "600px");
  
  // Header
  createElement("h3", "Skills").parent(skillsContainer);
  
  // Description right after header
  let skillsDesc = createP("Skills enhance specific abilities. Link a Skill to a Stat (e.g., Athletics to STR) to tie its effectiveness to that Stat’s value. Click a skill name for details. Only one Skill can link to a Stat at a time.");
  skillsDesc.parent(skillsContainer);
  skillsDesc.style("font-size", "12px");
  skillsDesc.style("color", "#666");
  skillsDesc.style("margin-top", "5px");
  skillsDesc.style("margin-bottom", "10px");
  
  // Skills dropdowns
  additionalAttributes.forEach(attr => {
    let attrDiv = createDiv();
    attrDiv.parent(skillsContainer);
    attrDiv.class("resource-row");
    
    let btn = createButton(attr.name);
    btn.parent(attrDiv);
    btn.style("background-color", attr.color);
    btn.style("color", "#fff");
    btn.class("resource-button");
    btn.mousePressed(() => { showStatDescription(attr.name, attr.desc); });
    
    let statSelect = createSelect();
    statSelect.parent(attrDiv);
    statSelect.option("None");
    ["STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"].forEach(stat => {
      statSelect.option(stat);
    });
    statSelect.changed(() => linkStatToSkill(attr.name, statSelect.value()));
    statSelect.elt.onchange = () => linkStatToSkill(attr.name, statSelect.value());
    attributeCheckboxes[attr.name] = statSelect;
  });
  
  updateSkillDropdowns();
}
function updateSkillDropdowns() {
  const allStats = ["STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"];
  let assignedStats = Object.values(attributeLinkMapping);
  
  additionalAttributes.forEach(attr => {
    let dropdown = attributeCheckboxes[attr.name];
    let currentStat = attributeLinkMapping[attr.name] || "None";
    
    dropdown.elt.innerHTML = "";
    let noneOption = document.createElement("option");
    noneOption.value = "None";
    noneOption.text = "None";
    dropdown.elt.add(noneOption);
    
    allStats.forEach(stat => {
      if (!assignedStats.includes(stat) || stat === currentStat) {
        let option = document.createElement("option");
        option.value = stat;
        option.text = stat;
        dropdown.elt.add(option);
      }
    });
    
    dropdown.elt.value = currentStat;
  });
}

function linkStatToSkill(skillName, selectedStat) {
  console.log(`Linking ${skillName} to ${selectedStat}`);
  
  if (attributeLinkMapping[skillName]) {
    let oldStat = attributeLinkMapping[skillName];
    delete statLinkMapping[oldStat];
    statLabelElements[oldStat].style("color", "black");
    console.log(`Unlinked ${oldStat} from ${skillName}`);
  }

  if (selectedStat === "None") {
    delete attributeLinkMapping[skillName];
    console.log(`Set ${skillName} to None`);
  } else {
    if (statLinkMapping[selectedStat]) {
      let oldSkill = statLinkMapping[selectedStat];
      delete attributeLinkMapping[oldSkill];
      attributeCheckboxes[oldSkill].value("None");
      console.log(`Unlinked ${selectedStat} from ${oldSkill}`);
    }
    statLinkMapping[selectedStat] = skillName;
    attributeLinkMapping[skillName] = selectedStat;
    let skillColor = additionalAttributes.find(a => a.name === skillName).color;
    statLabelElements[selectedStat].style("color", skillColor);
    console.log(`Linked ${selectedStat} to ${skillName}, color: ${skillColor}`);
  }
  
  console.log("statLinkMapping:", JSON.stringify(statLinkMapping));
  console.log("attributeLinkMapping:", JSON.stringify(attributeLinkMapping));
  updateSkillDropdowns();
}

function createTalentsUI() {
  let talentsContainerDiv = select("#talents");
  talentsContainerDiv.html("");

  createElement("h2", "Talents").parent(talentsContainerDiv);

  let talentsDesc = createP("Use buttons to add, edit, or remove talents. Click a talent's name to view its details. Use arrows to reorder.");
  talentsDesc.parent(talentsContainerDiv);
  talentsDesc.style("font-size", "12px");
  talentsDesc.style("color", "#666");
  talentsDesc.style("margin-top", "5px");
  talentsDesc.style("margin-bottom", "10px");

  // Add buttons
  let customButton = createButton("Add Custom Talent");
  customButton.parent(talentsContainerDiv);
  customButton.style("margin", "5px");
  customButton.mousePressed(showAddCustomTalentModal);

  let existingButton = createButton("Add Existing Talent");
  existingButton.parent(talentsContainerDiv);
  existingButton.style("margin", "5px");
  existingButton.mousePressed(showAddExistingTalentModal);

  let editExistingButton = createButton("Edit Existing Talent");
  editExistingButton.parent(talentsContainerDiv);
  editExistingButton.style("margin", "5px");
  editExistingButton.mousePressed(showEditExistingTalentModal);

  let removeButton = createButton("Remove Existing Talent");
  removeButton.parent(talentsContainerDiv);
  removeButton.style("margin", "5px");
  removeButton.mousePressed(showRemoveExistingTalentModal); // Restored button

  let defaultButton = createButton("Default Talent List");
  defaultButton.parent(talentsContainerDiv);
  defaultButton.style("margin", "5px");
  defaultButton.mousePressed(() => showConfirmationModal("Reset to default talent list?", resetToDefaultTalents));

  // Talent table setup (unchanged)
  let talentsTable = createElement("table");
  talentsTable.parent(talentsContainerDiv);
  talentsTable.id("talentsTable");
  talentsTable.style("width", "100%");
  talentsTable.style("border-collapse", "collapse");
  talentsTable.style("margin-top", "10px");

  let headerRow = createElement("tr");
  headerRow.parent(talentsTable);
  ["", "Name", "Level", "Category", "Actions"].forEach(header => {
    let th = createElement("th", header);
    th.parent(headerRow);
    th.style("border", "1px solid #ccc");
    th.style("padding", "5px");
    th.style("background", "#f2f2f2");
  });

  updateTalentsTable();
}

function showConfirmationModal(message, onConfirm) {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");
  
  createElement("p", message).parent(modalDiv);
  
  let confirmBtn = createButton("Confirm");
  confirmBtn.parent(modalDiv);
  confirmBtn.style("margin", "5px");
  confirmBtn.mousePressed(() => {
    onConfirm();
    modalDiv.remove();
    modalDiv = null;
  });
  
  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}

function manageLevelDependencies(levelCheckboxes, levelDescriptions, lvl) {
  if (lvl === "I") {
    if (!levelCheckboxes["I"].checked()) {
      levelCheckboxes["II"].checked(false);
      levelCheckboxes["III"].checked(false);
      levelDescriptions["II"].div.style("display", "none");
      levelDescriptions["III"].div.style("display", "none");
    }
  } else if (lvl === "II") {
    if (levelCheckboxes["II"].checked()) {
      levelCheckboxes["I"].checked(true);
      levelDescriptions["I"].div.style("display", "block");
    } else {
      levelCheckboxes["III"].checked(false);
      levelDescriptions["III"].div.style("display", "none");
    }
  } else if (lvl === "III") {
    if (levelCheckboxes["III"].checked()) {
      levelCheckboxes["I"].checked(true);
      levelCheckboxes["II"].checked(true);
      levelDescriptions["I"].div.style("display", "block");
      levelDescriptions["II"].div.style("display", "block");
    }
  }
  levelDescriptions[lvl].div.style("display", levelCheckboxes[lvl].checked() ? "block" : "none");
}

function showAddCustomTalentModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");

  createElement("h3", "Add Custom Talent").parent(modalDiv);

  let nameLabel = createSpan("Talent Name:");
  nameLabel.parent(modalDiv);
  let nameInput = createInput("");
  nameInput.parent(modalDiv);
  nameInput.style("width", "100%");
  nameInput.style("margin-bottom", "10px");

  let levelLabel = createSpan("Levels (select highest desired):");
  levelLabel.parent(modalDiv);

  let levelsDiv = createDiv();
  levelsDiv.parent(modalDiv);
  levelsDiv.style("margin-bottom", "10px");

  let levelCheckboxes = {};
  let levelDescriptions = {};
  ["I", "II", "III"].forEach(lvl => {
    let chkDiv = createDiv();
    chkDiv.parent(levelsDiv);
    let chk = createCheckbox(`Level ${lvl}`, false);
    chk.parent(chkDiv);
    levelCheckboxes[lvl] = chk;

    let descDiv = createDiv();
    descDiv.parent(levelsDiv);
    descDiv.style("display", "none");
    let descLabel = createSpan(`Description ${lvl}:`);
    descLabel.parent(descDiv);
    let descInput = createElement("textarea");
    descInput.parent(descDiv);
    descInput.style("width", "100%");
    descInput.style("height", "60px");
    descInput.style("margin-bottom", "5px");
    levelDescriptions[lvl] = { div: descDiv, input: descInput };

    chk.changed(() => manageLevelDependencies(levelCheckboxes, levelDescriptions, lvl));
  });

  let categoryLabel = createSpan("Category:");
  categoryLabel.parent(modalDiv);
  let categorySelect = createSelect();
  categorySelect.parent(modalDiv);
  categorySelect.option("Physical Combat");
  categorySelect.option("Magical");
  categorySelect.option("Ranged Combat");
  categorySelect.option("Defensive");
  categorySelect.option("Utility & Tactical");
  categorySelect.style("width", "100%");
  categorySelect.style("margin-bottom", "10px");

  let saveBtn = createButton("Save");
  saveBtn.parent(modalDiv);
  saveBtn.style("margin", "5px");
  saveBtn.mousePressed(() => {
    let name = nameInput.value();
    let category = categorySelect.value();
    if (!name || !category) return;

    // Determine the highest checked level
    let maxLevel = "I";
    if (levelCheckboxes["III"].checked()) maxLevel = "III";
    else if (levelCheckboxes["II"].checked()) maxLevel = "II";
    else if (!levelCheckboxes["I"].checked()) return; // Must have at least Level I

    // Enforce sequential levels and require descriptions
    let newTalents = [];
    let levels = ["I", "II", "III"].slice(0, ["I", "II", "III"].indexOf(maxLevel) + 1);
    for (let lvl of levels) {
      let desc = levelDescriptions[lvl].input.value();
      if (!desc) {
        alert(`Please provide a description for Level ${lvl}.`);
        return;
      }
      let talent = {
        name: name,
        level: lvl,
        category: category,
        description: desc,
        maxLevel: maxLevel
      };
      existingTalents.push(talent);
      newTalents.push(talent);
    }

    if (newTalents.length > 0) {
      talents.push(newTalents.find(t => t.level === "I")); // Start at Level I
      updateTalentsTable();
      modalDiv.remove();
      modalDiv = null;
    }
  });

  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}

function showAddExistingTalentModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");
  
  createElement("h3", "Add Existing Talent").parent(modalDiv);
  
  let talentLabel = createSpan("Select Talent:");
  talentLabel.parent(modalDiv);
  let talentSelect = createSelect();
  talentSelect.parent(modalDiv);
  let uniqueNames = [...new Set(existingTalents.map(t => t.name))];
  uniqueNames.forEach(name => {
    if (!talents.some(t => t.name === name)) { // Only show talents not already added
      talentSelect.option(name);
    }
  });
  talentSelect.style("width", "100%");
  talentSelect.style("margin-bottom", "10px");
  
  let saveBtn = createButton("Add");
  saveBtn.parent(modalDiv);
  saveBtn.style("margin", "5px");
  saveBtn.mousePressed(() => {
    let selectedName = talentSelect.value();
    if (!selectedName) return; // No options available or none selected
    
    let talentLevels = existingTalents.filter(t => t.name === selectedName);
    let baseTalent = talentLevels.find(t => t.level === "I") || talentLevels[0];
    if (baseTalent) {
      talents.push({ ...baseTalent });
      updateTalentsTable();
      modalDiv.remove();
      modalDiv = null;
    }
  });
  
  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}

function showEditExistingTalentModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");

  createElement("h3", "Edit Existing Talent").parent(modalDiv);

  let talentLabel = createSpan("Select Talent:");
  talentLabel.parent(modalDiv);
  let talentSelect = createSelect();
  talentSelect.parent(modalDiv);
  let uniqueNames = [...new Set(existingTalents.map(t => t.name))];
  uniqueNames.forEach(name => talentSelect.option(name));
  talentSelect.style("width", "100%");
  talentSelect.style("margin-bottom", "10px");

  let nameLabel = createSpan("Talent Name:");
  nameLabel.parent(modalDiv);
  let nameInput = createInput("");
  nameInput.parent(modalDiv);
  nameInput.style("width", "100%");
  nameInput.style("margin-bottom", "10px");

  let levelLabel = createSpan("Levels:");
  levelLabel.parent(modalDiv);

  let levelsDiv = createDiv();
  levelsDiv.parent(modalDiv);
  levelsDiv.style("margin-bottom", "10px");

  let levelCheckboxes = {};
  let levelDescriptions = {};

  let categoryLabel = createSpan("Category:");
  categoryLabel.parent(modalDiv);
  let categorySelect = createSelect();
  categorySelect.parent(modalDiv);
  categorySelect.option("Physical Combat");
  categorySelect.option("Magical");
  categorySelect.option("Ranged Combat");
  categorySelect.option("Defensive");
  categorySelect.option("Utility & Tactical");
  categorySelect.style("width", "100%");
  categorySelect.style("margin-bottom", "10px");

  function updateModalFields() {
    let selectedName = talentSelect.value();
    let talentLevels = existingTalents.filter(t => t.name === selectedName);
    let maxLevel = talentLevels[0]?.maxLevel || "III";
    nameInput.value(selectedName);
    categorySelect.value(talentLevels[0]?.category || "Physical Combat");

    for (let lvl in levelCheckboxes) {
      levelCheckboxes[lvl].parent().remove();
      levelDescriptions[lvl].div.remove();
    }
    levelCheckboxes = {};
    levelDescriptions = {};

    let availableLevels = ["I"];
    if (maxLevel === "II" || maxLevel === "III") availableLevels.push("II");
    if (maxLevel === "III") availableLevels.push("III");

    availableLevels.forEach(lvl => {
      let chkDiv = createDiv();
      chkDiv.parent(levelsDiv);
      let chk = createCheckbox(`Level ${lvl}`, talentLevels.some(t => t.level === lvl));
      chk.parent(chkDiv);
      levelCheckboxes[lvl] = chk;

      let descDiv = createDiv();
      descDiv.parent(levelsDiv);
      descDiv.style("display", chk.checked() ? "block" : "none");
      let descLabel = createSpan(`Description ${lvl}:`);
      descLabel.parent(descDiv);
      let descInput = createElement("textarea");
      descInput.parent(descDiv);
      descInput.style("width", "100%");
      descInput.style("height", "60px");
      descInput.style("margin-bottom", "5px");
      let existingDesc = talentLevels.find(t => t.level === lvl)?.description || "";
      descInput.value(existingDesc);
      levelDescriptions[lvl] = { div: descDiv, input: descInput };

      chk.changed(() => manageLevelDependencies(levelCheckboxes, levelDescriptions, lvl));
    });
  }

  talentSelect.changed(updateModalFields);
  updateModalFields();

  let saveBtn = createButton("Save");
  saveBtn.parent(modalDiv);
  saveBtn.style("margin", "5px");
  saveBtn.mousePressed(() => {
    let name = nameInput.value();
    let category = categorySelect.value();
    if (!name || !category || !levelCheckboxes["I"].checked()) return;

    let oldName = talentSelect.value();
    let originalMaxLevel = existingTalents.find(t => t.name === oldName)?.maxLevel || "III";

    // Determine the highest checked level
    let maxLevel = "I";
    if (levelCheckboxes["III"].checked()) maxLevel = "III";
    else if (levelCheckboxes["II"].checked()) maxLevel = "II";

    // Remove old talent entries
    for (let i = existingTalents.length - 1; i >= 0; i--) {
      if (existingTalents[i].name === oldName) {
        existingTalents.splice(i, 1);
      }
    }

    // Add new talent entries up to maxLevel
    let newTalents = [];
    let levels = ["I", "II", "III"].slice(0, ["I", "II", "III"].indexOf(maxLevel) + 1);
    for (let lvl of levels) {
      let desc = levelDescriptions[lvl].input.value();
      if (!desc) {
        alert(`Please provide a description for Level ${lvl}.`);
        return;
      }
      let talentData = {
        name: name,
        level: lvl,
        category: category,
        description: desc,
        maxLevel: maxLevel
      };
      existingTalents.push(talentData);
      newTalents.push(talentData);
    }

    // Update traits array
    traits = traits.map(t => {
      if (t.name === oldName) {
        let newTalent = newTalents.find(nt => nt.level === t.level) || 
                        newTalents.find(nt => nt.level === "I");
        return newTalent ? { ...newTalent } : t;
      }
      return t;
    });

    updateTalentsTable();
    modalDiv.remove();
    modalDiv = null;
  });

  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}

function showRemoveExistingTalentModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");
  
  createElement("h3", "Remove Existing Talent").parent(modalDiv);
  
  let talentLabel = createSpan("Select Talent to Remove:");
  talentLabel.parent(modalDiv);
  let talentSelect = createSelect();
  talentSelect.parent(modalDiv);
  let uniqueNames = [...new Set(existingTalents.map(t => t.name))];
  uniqueNames.forEach(name => talentSelect.option(name));
  talentSelect.style("width", "100%");
  talentSelect.style("margin-bottom", "10px");
  
  let removeBtn = createButton("Remove");
  removeBtn.parent(modalDiv);
  removeBtn.style("margin", "5px");
  removeBtn.mousePressed(() => {
    let selectedName = talentSelect.value();
    for (let i = existingTalents.length - 1; i >= 0; i--) {
      if (existingTalents[i].name === selectedName) {
        existingTalents.splice(i, 1);
      }
    }
    for (let i = talents.length - 1; i >= 0; i--) {
      if (talents[i].name === selectedName) {
        talents.splice(i, 1);
      }
    }
    updateTalentsTable();
    modalDiv.remove();
    modalDiv = null;
  });
  
  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}

function resetToDefaultTalents() {
  existingTalents = [...defaultTalents];
  talents = []; // Reset selected talents
  updateTalentsTable();
}

function moveTalentUp(index) {
  if (index > 0) {
    [talents[index - 1], talents[index]] = [talents[index], talents[index - 1]];
    updateTalentsTable();
  }
}

function moveTalentDown(index) {
  if (index < talents.length - 1) {
    [talents[index], talents[index + 1]] = [talents[index + 1], talents[index]];
    updateTalentsTable();
  }
}

function updateTalentsTable() {
  let talentsTable = select("#talentsTable");
  let rows = talentsTable.elt.getElementsByTagName("tr");
  while (rows.length > 1) rows[1].remove();

  talents.forEach((talent, index) => {
    let row = createElement("tr");
    row.parent(talentsTable);

    // Arrows for reordering
    let arrowCell = createElement("td");
    arrowCell.parent(row);
    arrowCell.style("border", "1px solid #ccc");
    arrowCell.style("padding", "5px");
    let upArrow = createButton("↑");
    upArrow.parent(arrowCell);
    upArrow.style("margin-right", "5px");
    upArrow.mousePressed(() => moveTalentUp(index));
    let downArrow = createButton("↓");
    downArrow.parent(arrowCell);
    downArrow.mousePressed(() => moveTalentDown(index));

    // Name (clickable for description)
    let nameCell = createElement("td", talent.name);
    nameCell.parent(row);
    nameCell.style("border", "1px solid #ccc");
    nameCell.style("padding", "5px");
    nameCell.style("cursor", "pointer");
    nameCell.mousePressed(() => {
      let talentData = existingTalents.find(t => t.name === talent.name && t.level === talent.level);
      showStatDescription(talent.name + " (Level " + talent.level + ")", talentData?.description || "No description available.");
    });

    // Level (dropdown)
    let levelCell = createElement("td");
    levelCell.parent(row);
    levelCell.style("border", "1px solid #ccc");
    levelCell.style("padding", "5px");
    let levelSelect = createSelect();
    levelSelect.parent(levelCell);
    let talentLevels = existingTalents.filter(t => t.name === talent.name);
    let availableLevels = talentLevels.map(t => t.level); // Show only existing levels
    availableLevels.forEach(lvl => levelSelect.option(lvl));
    levelSelect.value(talent.level);
    levelSelect.changed(() => {
      let newLevel = levelSelect.value();
      let newTalentData = existingTalents.find(t => t.name === talent.name && t.level === newLevel);
      if (newTalentData) {
        talents[index] = { ...newTalentData };
        updateTalentsTable();
      }
    });

    // Category
    let categoryCell = createElement("td", talent.category);
    categoryCell.parent(row);
    categoryCell.style("border", "1px solid #ccc");
    categoryCell.style("padding", "5px");

    // Actions (with Remove button)
    let actionCell = createElement("td");
    actionCell.parent(row);
    actionCell.style("border", "1px solid #ccc");
    actionCell.style("padding", "5px");
    let removeBtn = createButton("Remove");
    removeBtn.parent(actionCell);
    removeBtn.style("margin", "5px");
    removeBtn.mousePressed(() => {
      showConfirmationModal(`Remove ${talent.name} (Level ${talent.level})?`, () => {
        talents.splice(index, 1);
        updateTalentsTable();
      });
    });
  });
}
function showStatDescription(title, description) {
  if (descriptionModal) descriptionModal.remove();
  descriptionModal = createDiv();
  descriptionModal.style("position", "absolute");
  descriptionModal.style("top", "50%");
  descriptionModal.style("left", "50%");
  descriptionModal.style("transform", "translate(-50%, -50%)");
  descriptionModal.style("background", "#fff");
  descriptionModal.style("padding", "20px");
  descriptionModal.style("border", "2px solid #000");
  descriptionModal.style("z-index", "1000");
  descriptionModal.style("max-width", "400px");
  descriptionModal.style("word-wrap", "break-word");

  createElement("h3", title).parent(descriptionModal);
  createP(description).parent(descriptionModal);
  let closeBtn = createButton("Close");
  closeBtn.parent(descriptionModal);
  closeBtn.style("margin-top", "10px");
  closeBtn.mousePressed(() => {
    descriptionModal.remove();
    descriptionModal = null;
  });
}

function updateResourcesBasedOnStats() {
  max_hp = 25 + stat_vit * 5;
  current_hp = min(current_hp, max_hp);
  max_mp = 10 + stat_wil * 5;
  current_mp = min(current_mp, max_mp);
}

function tryLinking() {
  let selectedStat = null;
  let selectedAttribute = null;
  
  for (let stat in statCheckboxes) {
    if (statCheckboxes[stat].checked()) {
      if (selectedStat) {
        statCheckboxes[stat].checked(false);
        continue;
      }
      selectedStat = stat;
    }
  }
  
  for (let attr in attributeCheckboxes) {
    if (attributeCheckboxes[attr].checked()) {
      if (selectedAttribute) {
        attributeCheckboxes[attr].checked(false);
        continue;
      }
      selectedAttribute = attr;
    }
  }
  
  if (selectedStat && selectedAttribute) {
    statLinkMapping[selectedStat] = selectedAttribute;
    attributeLinkMapping[selectedAttribute] = selectedStat;
    statLabelElements[selectedStat].style("color", additionalAttributes.find(a => a.name === selectedAttribute).color);
  } else {
    if (selectedStat && statLinkMapping[selectedStat]) {
      let oldAttr = statLinkMapping[selectedStat];
      delete statLinkMapping[selectedStat];
      delete attributeLinkMapping[oldAttr];
      statLabelElements[selectedStat].style("color", "black");
      attributeCheckboxes[oldAttr].checked(false);
    }
    if (selectedAttribute && attributeLinkMapping[selectedAttribute]) {
      let oldStat = attributeLinkMapping[selectedAttribute];
      delete attributeLinkMapping[selectedAttribute];
      delete statLinkMapping[oldStat];
      statLabelElements[oldStat].style("color", "black");
      statCheckboxes[oldStat].checked(false);
    }
  }
}
function createTraitsUI() {
  let traitsContainerDiv = select("#traits");
  traitsContainerDiv.html("");

  createElement("h2", "Traits").parent(traitsContainerDiv);

  let traitsDesc = createP("Use buttons to add, edit, or remove traits. Click a trait's name to view its details. Use arrows to reorder.");
  traitsDesc.parent(traitsContainerDiv);
  traitsDesc.style("font-size", "12px");
  traitsDesc.style("color", "#666");
  traitsDesc.style("margin-top", "5px");
  traitsDesc.style("margin-bottom", "10px");

  // Add buttons
  let customButton = createButton("Add Custom Trait");
  customButton.parent(traitsContainerDiv);
  customButton.style("margin", "5px");
  customButton.mousePressed(showAddCustomTraitModal);

  let existingButton = createButton("Add Existing Trait");
  existingButton.parent(traitsContainerDiv);
  existingButton.style("margin", "5px");
  existingButton.mousePressed(showAddExistingTraitModal);

  let editExistingButton = createButton("Edit Existing Trait");
  editExistingButton.parent(traitsContainerDiv);
  editExistingButton.style("margin", "5px");
  editExistingButton.mousePressed(showEditExistingTraitModal);

  let removeButton = createButton("Remove Existing Trait");
  removeButton.parent(traitsContainerDiv);
  removeButton.style("margin", "5px");
  removeButton.mousePressed(showRemoveExistingTraitModal);

  let defaultButton = createButton("Default Trait List");
  defaultButton.parent(traitsContainerDiv);
  defaultButton.style("margin", "5px");
  defaultButton.mousePressed(() => showConfirmationModal("Reset to default trait list?", resetToDefaultTraits));

  // Traits table setup
  let traitsTable = createElement("table");
  traitsTable.parent(traitsContainerDiv);
  traitsTable.id("traitsTable");
  traitsTable.style("width", "100%");
  traitsTable.style("border-collapse", "collapse");
  traitsTable.style("margin-top", "10px");

  let headerRow = createElement("tr");
  headerRow.parent(traitsTable);
  ["", "Name", "Level", "Category", "Actions"].forEach(header => {
    let th = createElement("th", header);
    th.parent(headerRow);
    th.style("border", "1px solid #ccc");
    th.style("padding", "5px");
    th.style("background", "#f2f2f2");
  });

  updateTraitsTable();
}
function showAddCustomTraitModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");

  createElement("h3", "Add Custom Trait").parent(modalDiv);

  let nameLabel = createSpan("Trait Name:");
  nameLabel.parent(modalDiv);
  let nameInput = createInput("");
  nameInput.parent(modalDiv);
  nameInput.style("width", "100%");
  nameInput.style("margin-bottom", "10px");

  let levelLabel = createSpan("Levels (select highest desired):");
  levelLabel.parent(modalDiv);

  let levelsDiv = createDiv();
  levelsDiv.parent(modalDiv);
  levelsDiv.style("margin-bottom", "10px");

  let levelCheckboxes = {};
  let levelDescriptions = {};
  ["I", "II", "III"].forEach(lvl => {
    let chkDiv = createDiv();
    chkDiv.parent(levelsDiv);
    let chk = createCheckbox(`Level ${lvl}`, false);
    chk.parent(chkDiv);
    levelCheckboxes[lvl] = chk;

    let descDiv = createDiv();
    descDiv.parent(levelsDiv);
    descDiv.style("display", "none");
    let descLabel = createSpan(`Description ${lvl}:`);
    descLabel.parent(descDiv);
    let descInput = createElement("textarea");
    descInput.parent(descDiv);
    descInput.style("width", "100%");
    descInput.style("height", "60px");
    descInput.style("margin-bottom", "5px");
    levelDescriptions[lvl] = { div: descDiv, input: descInput };

    chk.changed(() => manageLevelDependencies(levelCheckboxes, levelDescriptions, lvl));
  });

  let categoryLabel = createSpan("Category:");
  categoryLabel.parent(modalDiv);
  let categorySelect = createSelect();
  categorySelect.parent(modalDiv);
  categorySelect.option("Physical");
  categorySelect.option("Combat");
  categorySelect.option("Magical");
  categorySelect.option("Spiritual");
  categorySelect.option("Utility");
  categorySelect.style("width", "100%");
  categorySelect.style("margin-bottom", "10px");

  let saveBtn = createButton("Save");
  saveBtn.parent(modalDiv);
  saveBtn.style("margin", "5px");
  saveBtn.mousePressed(() => {
    let name = nameInput.value();
    let category = categorySelect.value();
    if (!name || !category) return;

    let maxLevel = "I";
    if (levelCheckboxes["III"].checked()) maxLevel = "III";
    else if (levelCheckboxes["II"].checked()) maxLevel = "II";
    else if (!levelCheckboxes["I"].checked()) return;

    let newTraits = [];
    let levels = ["I", "II", "III"].slice(0, ["I", "II", "III"].indexOf(maxLevel) + 1);
    for (let lvl of levels) {
      let desc = levelDescriptions[lvl].input.value();
      if (!desc) {
        alert(`Please provide a description for Level ${lvl}.`);
        return;
      }
      let trait = {
        name: name,
        level: lvl,
        category: category,
        description: desc,
        maxLevel: maxLevel
      };
      existingTraits.push(trait);
      newTraits.push(trait);
    }

    if (newTraits.length > 0) {
      traits.push(newTraits.find(t => t.level === "I"));
      updateTraitsTable();
      modalDiv.remove();
      modalDiv = null;
    }
  });

  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}

function showAddExistingTraitModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");

  createElement("h3", "Add Existing Trait").parent(modalDiv);

  let traitLabel = createSpan("Select Trait:");
  traitLabel.parent(modalDiv);
  let traitSelect = createSelect();
  traitSelect.parent(modalDiv);
  let uniqueNames = [...new Set(existingTraits.map(t => t.name))];
  uniqueNames.forEach(name => {
    if (!traits.some(t => t.name === name)) {
      traitSelect.option(name);
    }
  });
  traitSelect.style("width", "100%");
  traitSelect.style("margin-bottom", "10px");

  let saveBtn = createButton("Add");
  saveBtn.parent(modalDiv);
  saveBtn.style("margin", "5px");
  saveBtn.mousePressed(() => {
    let selectedName = traitSelect.value();
    if (!selectedName) return;

    let traitLevels = existingTraits.filter(t => t.name === selectedName);
    let baseTrait = traitLevels.find(t => t.level === "I") || traitLevels[0];
    if (baseTrait) {
      traits.push({ ...baseTrait });
      updateTraitsTable();
      modalDiv.remove();
      modalDiv = null;
    }
  });

  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}

function showEditExistingTraitModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");

  createElement("h3", "Edit Existing Trait").parent(modalDiv);

  let traitLabel = createSpan("Select Trait:");
  traitLabel.parent(modalDiv);
  let traitSelect = createSelect();
  traitSelect.parent(modalDiv);
  let uniqueNames = [...new Set(existingTraits.map(t => t.name))];
  uniqueNames.forEach(name => traitSelect.option(name));
  traitSelect.style("width", "100%");
  traitSelect.style("margin-bottom", "10px");

  let nameLabel = createSpan("Trait Name:");
  nameLabel.parent(modalDiv);
  let nameInput = createInput("");
  nameInput.parent(modalDiv);
  nameInput.style("width", "100%");
  nameInput.style("margin-bottom", "10px");

  let levelLabel = createSpan("Levels:");
  levelLabel.parent(modalDiv);

  let levelsDiv = createDiv();
  levelsDiv.parent(modalDiv);
  levelsDiv.style("margin-bottom", "10px");

  let levelCheckboxes = {};
  let levelDescriptions = {};

  let categoryLabel = createSpan("Category:");
  categoryLabel.parent(modalDiv);
  let categorySelect = createSelect();
  categorySelect.parent(modalDiv);
  categorySelect.option("Physical");
  categorySelect.option("Combat");
  categorySelect.option("Magical");
  categorySelect.option("Spiritual");
  categorySelect.option("Utility");
  categorySelect.style("width", "100%");
  categorySelect.style("margin-bottom", "10px");

  function updateModalFields() {
    let selectedName = traitSelect.value();
    let traitLevels = existingTraits.filter(t => t.name === selectedName);
    let maxLevel = traitLevels[0]?.maxLevel || "III";
    nameInput.value(selectedName);
    categorySelect.value(traitLevels[0]?.category || "Physical");

    for (let lvl in levelCheckboxes) {
      levelCheckboxes[lvl].parent().remove();
      levelDescriptions[lvl].div.remove();
    }
    levelCheckboxes = {};
    levelDescriptions = {};

    let availableLevels = ["I"];
    if (maxLevel === "II" || maxLevel === "III") availableLevels.push("II");
    if (maxLevel === "III") availableLevels.push("III");

    availableLevels.forEach(lvl => {
      let chkDiv = createDiv();
      chkDiv.parent(levelsDiv);
      let chk = createCheckbox(`Level ${lvl}`, traitLevels.some(t => t.level === lvl));
      chk.parent(chkDiv);
      levelCheckboxes[lvl] = chk;

      let descDiv = createDiv();
      descDiv.parent(levelsDiv);
      descDiv.style("display", chk.checked() ? "block" : "none");
      let descLabel = createSpan(`Description ${lvl}:`);
      descLabel.parent(descDiv);
      let descInput = createElement("textarea");
      descInput.parent(descDiv);
      descInput.style("width", "100%");
      descInput.style("height", "60px");
      descInput.style("margin-bottom", "5px");
      let existingDesc = traitLevels.find(t => t.level === lvl)?.description || "";
      descInput.value(existingDesc);
      levelDescriptions[lvl] = { div: descDiv, input: descInput };

      chk.changed(() => manageLevelDependencies(levelCheckboxes, levelDescriptions, lvl));
    });
  }

  traitSelect.changed(updateModalFields);
  updateModalFields();

  let saveBtn = createButton("Save");
  saveBtn.parent(modalDiv);
  saveBtn.style("margin", "5px");
  saveBtn.mousePressed(() => {
    let name = nameInput.value();
    let category = categorySelect.value();
    if (!name || !category || !levelCheckboxes["I"].checked()) return;

    let oldName = traitSelect.value();
    let maxLevel = existingTraits.find(t => t.name === oldName)?.maxLevel || "III";
    for (let i = existingTraits.length - 1; i >= 0; i--) {
      if (existingTraits[i].name === oldName) {
        existingTraits.splice(i, 1);
      }
    }

    ["I", "II", "III"].forEach(lvl => {
      if (levelCheckboxes[lvl] && levelCheckboxes[lvl].checked() && levelDescriptions[lvl].input.value()) {
        let traitData = {
          name: name,
          level: lvl,
          category: category,
          description: levelDescriptions[lvl].input.value(),
          maxLevel: maxLevel
        };
        existingTraits.push(traitData);
      }
    });

    traits = traits.map(t => {
      if (t.name === oldName) {
        let newTrait = existingTraits.find(nt => nt.name === name && nt.level === t.level) || 
                       existingTraits.find(nt => nt.name === name && nt.level === "I");
        return newTrait ? { ...newTrait } : t;
      }
      return t;
    });

    updateTraitsTable();
    modalDiv.remove();
    modalDiv = null;
  });

  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}

function showRemoveExistingTraitModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv();
  modalDiv.style("position", "absolute");
  modalDiv.style("top", "50%");
  modalDiv.style("left", "50%");
  modalDiv.style("transform", "translate(-50%, -50%)");
  modalDiv.style("background", "#fff");
  modalDiv.style("padding", "20px");
  modalDiv.style("border", "2px solid #000");
  modalDiv.style("z-index", "1000");
  modalDiv.style("width", "300px");

  createElement("h3", "Remove Existing Trait").parent(modalDiv);

  let traitLabel = createSpan("Select Trait to Remove:");
  traitLabel.parent(modalDiv);
  let traitSelect = createSelect();
  traitSelect.parent(modalDiv);
  let uniqueNames = [...new Set(existingTraits.map(t => t.name))];
  uniqueNames.forEach(name => traitSelect.option(name));
  traitSelect.style("width", "100%");
  traitSelect.style("margin-bottom", "10px");

  let removeBtn = createButton("Remove");
  removeBtn.parent(modalDiv);
  removeBtn.style("margin", "5px");
  removeBtn.mousePressed(() => {
    let selectedName = traitSelect.value();
    for (let i = existingTraits.length - 1; i >= 0; i--) {
      if (existingTraits[i].name === selectedName) {
        existingTraits.splice(i, 1);
      }
    }
    for (let i = traits.length - 1; i >= 0; i--) {
      if (traits[i].name === selectedName) {
        traits.splice(i, 1);
      }
    }
    updateTraitsTable();
    modalDiv.remove();
    modalDiv = null;
  });

  let cancelBtn = createButton("Cancel");
  cancelBtn.parent(modalDiv);
  cancelBtn.style("margin", "5px");
  cancelBtn.mousePressed(() => { modalDiv.remove(); modalDiv = null; });
}
function updateTraitsTable() {
  let traitsTable = select("#traitsTable");
  let rows = traitsTable.elt.getElementsByTagName("tr");
  while (rows.length > 1) rows[1].remove();

  traits.forEach((trait, index) => {
    let row = createElement("tr");
    row.parent(traitsTable);

    let arrowCell = createElement("td");
    arrowCell.parent(row);
    arrowCell.style("border", "1px solid #ccc");
    arrowCell.style("padding", "5px");
    let upArrow = createButton("↑");
    upArrow.parent(arrowCell);
    upArrow.style("margin-right", "5px");
    upArrow.mousePressed(() => moveTraitUp(index));
    let downArrow = createButton("↓");
    downArrow.parent(arrowCell);
    downArrow.mousePressed(() => moveTraitDown(index));

    let nameCell = createElement("td", trait.name);
    nameCell.parent(row);
    nameCell.style("border", "1px solid #ccc");
    nameCell.style("padding", "5px");
    nameCell.style("cursor", "pointer");
    nameCell.mousePressed(() => {
      let traitData = existingTraits.find(t => t.name === trait.name && t.level === trait.level);
      showStatDescription(trait.name + " (Level " + trait.level + ")", traitData?.description || "No description available.");
    });

    let levelCell = createElement("td");
    levelCell.parent(row);
    levelCell.style("border", "1px solid #ccc");
    levelCell.style("padding", "5px");
    let levelSelect = createSelect();
    levelSelect.parent(levelCell);
    let traitLevels = existingTraits.filter(t => t.name === trait.name);
    let availableLevels = traitLevels.map(t => t.level);
    availableLevels.forEach(lvl => levelSelect.option(lvl));
    levelSelect.value(trait.level);
    levelSelect.changed(() => {
      let newLevel = levelSelect.value();
      let newTraitData = existingTraits.find(t => t.name === trait.name && t.level === newLevel);
      if (newTraitData) {
        traits[index] = { ...newTraitData };
        updateTraitsTable();
      }
    });

    let categoryCell = createElement("td", trait.category);
    categoryCell.parent(row);
    categoryCell.style("border", "1px solid #ccc");
    categoryCell.style("padding", "5px");

    let actionCell = createElement("td");
    actionCell.parent(row);
    actionCell.style("border", "1px solid #ccc");
    actionCell.style("padding", "5px");
    let removeBtn = createButton("Remove");
    removeBtn.parent(actionCell);
    removeBtn.style("margin", "5px");
    removeBtn.mousePressed(() => {
      showConfirmationModal(`Remove ${trait.name} (Level ${trait.level})?`, () => {
        traits.splice(index, 1);
        updateTraitsTable();
      });
    });
  });
}

function moveTraitUp(index) {
  if (index > 0) {
    [traits[index - 1], traits[index]] = [traits[index], traits[index - 1]];
    updateTraitsTable();
  }
}

function moveTraitDown(index) {
  if (index < traits.length - 1) {
    [traits[index], traits[index + 1]] = [traits[index + 1], traits[index]];
    updateTraitsTable();
  }
}

function resetToDefaultTraits() {
  existingTraits = [...defaultTraits];
  traits = [];
  updateTraitsTable();
}
