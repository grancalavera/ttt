describe("root move validator ", () => {
  xit("should never throw", () => {
    expect(() => {
      throw new Error("boom!");
    }).not.toThrow();
  });
});
