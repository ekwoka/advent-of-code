describe('2015 Day 1', async () => {
  const { partOne, partTwo } = await import('./index');
  it('Passes Part 1 Test', () => {
    expect(partOne(sample)).toBe(0);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(0);
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(sample)).toBe(0);
  });
  it.skip('Passes Part 2', () => {
    expect(partTwo(input)).toBe(0);
  }, 15_000);
});
