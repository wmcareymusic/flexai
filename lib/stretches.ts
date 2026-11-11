export type Stretch = {
  id: string;
  name: string;
  description: string;
  category: "Dynamic Warm-up" | "Static Hold" | "Mobility";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  muscleGroup: string;
  duration: number;
  unit: "seconds" | "reps";
  cues: string[];
  imageUrl: string;
  videoUrl: string;
};

export const STRETCH_BANK: Stretch[] = [
  { id: "cat-cow", name: "Cat-Cow Flow", description: "Spinal mobility flow to warm up back and core.", category: "Dynamic Warm-up", difficulty: "Beginner", muscleGroup: "Spine / Core", duration: 12, unit: "reps", cues: ["Round then arch", "Move with breath", "Hips over knees"], imageUrl: "/placeholders/cat-cow.jpg", videoUrl: "/placeholders/cat-cow.mp4" },
  { id: "hip-flexor-lunge", name: "Hip Flexor Lunge Stretch", description: "Half-kneeling stretch for tight hip flexors from sitting.", category: "Static Hold", difficulty: "Beginner", muscleGroup: "Hip Flexors", duration: 45, unit: "seconds", cues: ["Tuck pelvis slightly", "Tall chest", "Squeeze back glute"], imageUrl: "/placeholders/hip-flexor.jpg", videoUrl: "/placeholders/hip-flexor.mp4" },
  { id: "standing-hamstring", name: "Standing Hamstring Stretch", description: "Gentle hamstring lengthening with neutral spine.", category: "Static Hold", difficulty: "Beginner", muscleGroup: "Hamstrings", duration: 30, unit: "seconds", cues: ["Hinge at hips", "Keep back flat", "Slight knee bend"], imageUrl: "/placeholders/hamstring.jpg", videoUrl: "/placeholders/hamstring.mp4" },
  { id: "doorway-chest", name: "Doorway Chest Opener", description: "Opens chest and shoulders after desk work.", category: "Static Hold", difficulty: "Beginner", muscleGroup: "Chest / Shoulders", duration: 40, unit: "seconds", cues: ["Elbow at shoulder height", "Step through gently", "Breathe into chest"], imageUrl: "/placeholders/chest.jpg", videoUrl: "/placeholders/chest.mp4" },
  { id: "neck-release", name: "Neck Release Stretch", description: "Releases neck and upper trap tension.", category: "Static Hold", difficulty: "Beginner", muscleGroup: "Neck / Traps", duration: 30, unit: "seconds", cues: ["Ear to shoulder", "Opposite shoulder down", "No forcing"], imageUrl: "/placeholders/neck.jpg", videoUrl: "/placeholders/neck.mp4" },
  { id: "worlds-greatest", name: "World's Greatest Stretch", description: "Full body lunge, rotation, and hip opener in one move.", category: "Dynamic Warm-up", difficulty: "Intermediate", muscleGroup: "Full Body", duration: 8, unit: "reps", cues: ["Long lunge", "Rotate over front leg", "Keep hips low"], imageUrl: "/placeholders/worlds.jpg", videoUrl: "/placeholders/worlds.mp4" },
  { id: "pigeon", name: "Pigeon Pose", description: "Deep glute and hip opener. Keep hips square.", category: "Static Hold", difficulty: "Intermediate", muscleGroup: "Glutes / Hips", duration: 60, unit: "seconds", cues: ["Square hips", "Flex front foot", "Breathe into hip"], imageUrl: "/placeholders/pigeon.jpg", videoUrl: "/placeholders/pigeon.mp4" },
  { id: "thoracic-rotation", name: "Thoracic Rotation", description: "Quadruped mid-back rotation for desk stiffness.", category: "Mobility", difficulty: "Intermediate", muscleGroup: "Mid-Back", duration: 10, unit: "reps", cues: ["Hand behind head", "Elbow to ceiling", "Hips still"], imageUrl: "/placeholders/thoracic.jpg", videoUrl: "/placeholders/thoracic.mp4" },
  { id: "down-dog-cobra", name: "Down Dog to Cobra Flow", description: "Flow for posterior chain and spine.", category: "Dynamic Warm-up", difficulty: "Intermediate", muscleGroup: "Posterior Chain", duration: 10, unit: "reps", cues: ["Push hips back", "Flow slowly", "Look forward in cobra"], imageUrl: "/placeholders/flow.jpg", videoUrl: "/placeholders/flow.mp4" },
  { id: "deep-squat", name: "Deep Squat Hold", description: "Hip and ankle mobility hold.", category: "Static Hold", difficulty: "Advanced", muscleGroup: "Hips / Ankles", duration: 45, unit: "seconds", cues: ["Heels down if possible", "Chest tall", "Knees track toes"], imageUrl: "/placeholders/squat.jpg", videoUrl: "/placeholders/squat.mp4" },
  { id: "90-90-switch", name: "90/90 Hip Switches", description: "Hip internal and external rotation.", category: "Mobility", difficulty: "Intermediate", muscleGroup: "Hips", duration: 12, unit: "reps", cues: ["Both knees at 90", "Switch without hands", "Stay tall"], imageUrl: "/placeholders/9090.jpg", videoUrl: "/placeholders/9090.mp4" },
  { id: "standing-quad", name: "Standing Quad Stretch", description: "Classic quad stretch with balance.", category: "Static Hold", difficulty: "Beginner", muscleGroup: "Quads", duration: 30, unit: "seconds", cues: ["Hold wall if needed", "Knees together", "Tuck pelvis"], imageUrl: "/placeholders/quad.jpg", videoUrl: "/placeholders/quad.mp4" },
  { id: "childs-pose", name: "Child's Pose", description: "Restorative back and lat stretch.", category: "Static Hold", difficulty: "Beginner", muscleGroup: "Back / Lats", duration: 60, unit: "seconds", cues: ["Hips to heels", "Arms long", "Breathe into back"], imageUrl: "/placeholders/childs.jpg", videoUrl: "/placeholders/childs.mp4" },
  { id: "thread-needle", name: "Thread the Needle", description: "Shoulder and mid-back rotation stretch.", category: "Mobility", difficulty: "Beginner", muscleGroup: "Shoulders / Mid-Back", duration: 10, unit: "reps", cues: ["Thread arm under", "Rest shoulder down", "Rotate open"], imageUrl: "/placeholders/thread.jpg", videoUrl: "/placeholders/thread.mp4" },
  { id: "calf-wall", name: "Wall Calf Stretch", description: "Calf stretch for runners and walkers.", category: "Static Hold", difficulty: "Beginner", muscleGroup: "Calves", duration: 40, unit: "seconds", cues: ["Back heel down", "Back leg straight", "Lean into wall"], imageUrl: "/placeholders/calf.jpg", videoUrl: "/placeholders/calf.mp4" },
];
