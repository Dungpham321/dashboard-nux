export function useGridState(id: string) {
  return {
    gridRef: useState(`gridRef-${id}`, () => ref(null)),
    editMode: useState(`editMode-${id}`, () => ref('')),
    gridKey: useState(`gridKey-${id}`, () => ref(Date.now()))
  }
}
