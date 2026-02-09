export const generateData = (count = 50) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    label: `Data Point ${i + 1}`,
    value: Math.random(), // 0 to 1
    position: [
      (Math.random() - 0.5) * 20, // X: -10 to 10
      0, // Y: Initial position, will be overridden by animation/value
      (Math.random() - 0.5) * 20, // Z: -10 to 10
    ],
  }));
};
