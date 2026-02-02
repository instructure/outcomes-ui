const mockCSVData = [
  { Student: 'Alice', Score: 1 },
  { Student: 'Bob', Score: 2 },
  { Student: 'Charlie', Score: 3 },
]

const mockCSVExportHandler = async () => new Promise<object[]>((res) => {
  setTimeout(() => {
    res(mockCSVData)
  }, 500)
})

const mockCSVFileName = 'custom-gradebook-export.csv'

export const mockCSVExportProps = {
  csvFileName: mockCSVFileName,
  csvExportHandler: mockCSVExportHandler,
}
