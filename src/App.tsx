import { useState } from 'react'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Separator } from './components/ui/separator'
import { Copy, Download, Zap, Code, FileText, ShieldCheck, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { deobfuscator, type DeobfuscationResult } from './lib/deobfuscator'
import { EXAMPLE_CODES, EXAMPLE_DESCRIPTIONS } from './lib/examples'

function App() {
  const [inputCode, setInputCode] = useState('')
  const [outputCode, setOutputCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<DeobfuscationResult | null>(null)

  const deobfuscateCode = async () => {
    if (!inputCode.trim()) {
      toast.error('Please enter some obfuscated code')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setOutputCode('')
    setResult(null)

    // Simulate processing steps for visual feedback
    const steps = [
      { name: 'Parsing code structure', duration: 300 },
      { name: 'Decoding strings', duration: 400 },
      { name: 'Renaming variables', duration: 500 },
      { name: 'Analyzing functions', duration: 450 },
      { name: 'Simplifying expressions', duration: 350 },
      { name: 'Final formatting', duration: 200 }
    ]

    let totalProgress = 0
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      await new Promise(resolve => setTimeout(resolve, step.duration))
      totalProgress = ((i + 1) / steps.length) * 100
      setProgress(totalProgress)
    }

    // Use the advanced deobfuscator
    const deobfuscationResult = deobfuscator.deobfuscate(inputCode)
    
    setOutputCode(deobfuscationResult.deobfuscatedCode)
    setResult(deobfuscationResult)

    setIsProcessing(false)
    toast.success(`Deobfuscation completed! Confidence: ${deobfuscationResult.statistics.confidence}%`)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${filename} downloaded!`)
  }

  const loadExample = (exampleKey: keyof typeof EXAMPLE_CODES) => {
    setInputCode(EXAMPLE_CODES[exampleKey])
    setOutputCode('')
    setResult(null)
    toast.success(`Loaded ${exampleKey} example`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <ShieldCheck className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  MoonsecV3 Deobfuscator
                </h1>
                <p className="text-slate-400 text-sm">Advanced Lua code analysis and deobfuscation tool</p>
              </div>
            </div>
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center">
                  <Code className="h-5 w-5 mr-2 text-cyan-400" />
                  Obfuscated Code Input
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Paste your MoonsecV3 obfuscated Lua code below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="-- Paste your obfuscated code here..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="min-h-[300px] bg-slate-950/50 border-slate-600 text-slate-100 font-mono text-sm resize-none focus:border-cyan-500 transition-colors"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span>{inputCode.split('\n').length} lines</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>{inputCode.length} characters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInputCode('')}
                      className="border-slate-600 hover:border-red-500 hover:text-red-400"
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={deobfuscateCode}
                      disabled={isProcessing || !inputCode.trim()}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Deobfuscate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Examples Section */}
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">Try Examples:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {Object.entries(EXAMPLE_DESCRIPTIONS).map(([key, description]) => (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(key as keyof typeof EXAMPLE_CODES)}
                        className="border-slate-600 hover:border-cyan-500 hover:text-cyan-400 text-xs h-auto py-2 px-3 flex flex-col items-start gap-1"
                      >
                        <span className="font-medium capitalize">{key}</span>
                        <span className="text-slate-400 text-left leading-tight">{description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 text-sm">Analysis Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Original Lines</span>
                    <span className="text-slate-100 font-mono">{result?.statistics.originalLines || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Variables Renamed</span>
                    <span className="text-cyan-400 font-mono">{result?.statistics.variablesRenamed || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Strings Decoded</span>
                    <span className="text-cyan-400 font-mono">{result?.statistics.stringsDecoded || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Functions Found</span>
                    <span className="text-cyan-400 font-mono">{result?.statistics.functionsAnalyzed || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Complexity</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        result?.statistics.complexity === 'High' ? 'border-red-500/30 text-red-400' :
                        result?.statistics.complexity === 'Medium' ? 'border-yellow-500/30 text-yellow-400' :
                        'border-green-500/30 text-green-400'
                      }`}
                    >
                      {result?.statistics.complexity || 'Unknown'}
                    </Badge>
                  </div>
                  {result && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Confidence</span>
                      <span className="text-green-400 font-mono">{result.statistics.confidence}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {isProcessing && (
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-100 text-sm flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full" />
                    Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-slate-400 mt-2">{Math.round(progress)}% complete</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Output Section */}
        {outputCode && (
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-400" />
                    Deobfuscated Output
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Clean, readable Lua code with improved variable names
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(outputCode, 'Deobfuscated code')}
                    className="border-slate-600 hover:border-cyan-500 hover:text-cyan-400"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(outputCode, 'deobfuscated.lua')}
                    className="border-slate-600 hover:border-green-500 hover:text-green-400"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputCode}
                readOnly
                className="min-h-[300px] bg-slate-950/50 border-slate-600 text-slate-100 font-mono text-sm resize-none"
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <FileText className="h-4 w-4" />
                  <span>{outputCode.split('\n').length} lines</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{outputCode.length} characters</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                    <span>Deobfuscated</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>This tool provides basic deobfuscation. Complex obfuscation may require manual analysis.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App