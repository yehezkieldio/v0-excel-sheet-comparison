"use client"

import type React from "react"

import { useState, useRef, useCallback, memo } from "react"
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { parseExcelFile } from "@/lib/excel-parser"
import { compareSheets } from "@/lib/comparison-engine"
import type { ComparisonResult } from "@/lib/types"
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants"

interface ExcelUploaderProps {
  onComparisonComplete: (result: ComparisonResult) => void
  onError: (error: string) => void
}

export const ExcelUploader = memo(function ExcelUploader({ onComparisonComplete, onError }: ExcelUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const processFile = useCallback(
    async (file: File) => {
      // Validate file type
      const isValidType = ACCEPTED_FILE_TYPES.some((type) => file.name.endsWith(type))
      if (!isValidType) {
        onError(`Please upload a valid Excel file (${ACCEPTED_FILE_TYPES.join(", ")})`)
        return
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        onError(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`)
        return
      }

      setIsProcessing(true)
      setFileName(file.name)

      try {
        const parsedData = await parseExcelFile(file)
        const comparisonResult = compareSheets(parsedData)
        onComparisonComplete(comparisonResult)
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed to process Excel file")
      } finally {
        setIsProcessing(false)
      }
    },
    [onComparisonComplete, onError]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        await processFile(file)
      }
    },
    [processFile]
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        await processFile(file)
      }
    },
    [processFile]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-2xl p-8">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"}
            ${isProcessing ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" />

          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Processing Excel File</h3>
                  <p className="text-sm text-muted-foreground mt-1">Analyzing {fileName}...</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Upload Excel File</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag and drop your Excel file here, or click to browse
                  </p>
                </div>
                <Button variant="outline" className="mt-2 bg-transparent">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Select File
                </Button>
              </>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Required sheets: <span className="font-mono text-foreground">JASTER</span>,{" "}
              <span className="font-mono text-foreground">CIS</span>,{" "}
              <span className="font-mono text-foreground">UNIFIKASI</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
})
