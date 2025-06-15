// MoonsecV3 Deobfuscation Engine
// This module contains advanced pattern recognition and code transformation logic

export interface DeobfuscationResult {
  deobfuscatedCode: string;
  statistics: {
    originalLines: number;
    deobfuscatedLines: number;
    variablesRenamed: number;
    stringsDecoded: number;
    functionsAnalyzed: number;
    complexity: 'Low' | 'Medium' | 'High';
    confidence: number;
  };
  warnings: string[];
}

export class MoonsecV3Deobfuscator {
  private variableMap: Map<string, string> = new Map();
  private functionMap: Map<string, string> = new Map();
  private stringMap: Map<string, string> = new Map();
  private variableCounter = 0;
  private functionCounter = 0;

  public deobfuscate(obfuscatedCode: string): DeobfuscationResult {
    let code = obfuscatedCode;
    const warnings: string[] = [];
    
    // Reset counters
    this.variableMap.clear();
    this.functionMap.clear();
    this.stringMap.clear();
    this.variableCounter = 0;
    this.functionCounter = 0;

    // Step 1: Decode hex and escape sequences
    code = this.decodeStrings(code);
    
    // Step 2: Beautify and format
    code = this.formatCode(code);
    
    // Step 3: Rename obfuscated variables
    code = this.renameVariables(code);
    
    // Step 4: Rename obfuscated functions
    code = this.renameFunctions(code);
    
    // Step 5: Simplify expressions
    code = this.simplifyExpressions(code);
    
    // Step 6: Remove dead code and unused variables
    code = this.removeDeadCode(code);
    
    // Step 7: Final formatting
    code = this.finalFormat(code);

    // Calculate statistics
    const originalLines = obfuscatedCode.split('\n').length;
    const deobfuscatedLines = code.split('\n').length;
    const variablesRenamed = this.variableMap.size;
    const stringsDecoded = this.stringMap.size;
    const functionsAnalyzed = this.functionMap.size;
    
    // Determine complexity
    let complexity: 'Low' | 'Medium' | 'High' = 'Low';
    if (originalLines > 200 || variablesRenamed > 50) complexity = 'High';
    else if (originalLines > 50 || variablesRenamed > 20) complexity = 'Medium';
    
    // Calculate confidence based on successful transformations
    const confidence = Math.min(95, 40 + (variablesRenamed * 2) + (stringsDecoded * 3) + (functionsAnalyzed * 5));

    return {
      deobfuscatedCode: code,
      statistics: {
        originalLines,
        deobfuscatedLines,
        variablesRenamed,
        stringsDecoded,
        functionsAnalyzed,
        complexity,
        confidence
      },
      warnings
    };
  }

  private decodeStrings(code: string): string {
    // Decode hex strings
    code = code.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => {
      const char = String.fromCharCode(parseInt(hex, 16));
      return char.match(/[a-zA-Z0-9 ]/) ? char : `\\x${hex}`;
    });

    // Decode numeric escape sequences
    code = code.replace(/\\(\d{1,3})/g, (match, num) => {
      const charCode = parseInt(num, 10);
      if (charCode >= 32 && charCode <= 126) {
        const char = String.fromCharCode(charCode);
        this.stringMap.set(match, char);
        return char;
      }
      return match;
    });

    // Decode simple string concatenations
    code = code.replace(/"([^"]*?)"\s*\.\.\s*"([^"]*?)"/g, '"$1$2"');
    
    return code;
  }

  private formatCode(code: string): string {
    // Remove excessive whitespace
    code = code.replace(/\s+/g, ' ');
    
    // Add proper line breaks
    code = code.replace(/;/g, ';\n');
    code = code.replace(/\{/g, '{\n');
    code = code.replace(/\}/g, '\n}\n');
    code = code.replace(/,(?!\s*[}\]])/g, ',\n');
    
    // Basic indentation
    const lines = code.split('\n');
    let indentLevel = 0;
    const indentedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      if (trimmed.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
      const result = '  '.repeat(indentLevel) + trimmed;
      if (trimmed.includes('{')) indentLevel++;
      
      return result;
    });
    
    return indentedLines.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');
  }

  private renameVariables(code: string): string {
    // Common obfuscated variable patterns
    const obfuscatedPatterns = [
      /\b[a-zA-Z][0-9a-fA-F]{6,}\b/g, // Hex-like variables
      /\b[a-zA-Z]\d{3,}\b/g,          // Variables with many numbers
      /\b[a-zA-Z]{1,2}_[0-9a-fA-F]+\b/g, // Underscore patterns
      /\bvar_[0-9a-fA-F]+\b/g,        // Common obfuscated prefixes
    ];

    const meaningfulNames = [
      'player', 'game', 'character', 'position', 'velocity', 'health', 'score',
      'level', 'weapon', 'item', 'inventory', 'skill', 'experience', 'gold',
      'magic', 'spell', 'ability', 'status', 'effect', 'timer', 'counter',
      'flag', 'state', 'mode', 'config', 'setting', 'option', 'value',
      'result', 'output', 'input', 'data', 'info', 'message', 'text',
      'string', 'number', 'boolean', 'table', 'array', 'list', 'queue'
    ];

    obfuscatedPatterns.forEach(pattern => {
      const matches = code.match(pattern) || [];
      const uniqueMatches = [...new Set(matches)];
      
      uniqueMatches.forEach(match => {
        if (!this.variableMap.has(match)) {
          const baseName = meaningfulNames[this.variableCounter % meaningfulNames.length];
          const suffix = Math.floor(this.variableCounter / meaningfulNames.length);
          const newName = suffix > 0 ? `${baseName}_${suffix}` : baseName;
          this.variableMap.set(match, newName);
          this.variableCounter++;
        }
      });
    });

    // Replace variables
    this.variableMap.forEach((newName, oldName) => {
      const regex = new RegExp(`\\b${oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      code = code.replace(regex, newName);
    });

    return code;
  }

  private renameFunctions(code: string): string {
    // Pattern for obfuscated function names
    const functionPattern = /function\s+([a-zA-Z][0-9a-fA-F]{4,})\s*\(/g;
    const functionNames = ['initialize', 'update', 'render', 'process', 'handle', 'execute', 'perform', 'calculate', 'validate', 'transform'];
    
    let match;
    while ((match = functionPattern.exec(code)) !== null) {
      const obfuscatedName = match[1];
      if (!this.functionMap.has(obfuscatedName)) {
        const baseName = functionNames[this.functionCounter % functionNames.length];
        const suffix = Math.floor(this.functionCounter / functionNames.length);
        const newName = suffix > 0 ? `${baseName}_${suffix}` : baseName;
        this.functionMap.set(obfuscatedName, newName);
        this.functionCounter++;
      }
    }

    // Replace function names
    this.functionMap.forEach((newName, oldName) => {
      const regex = new RegExp(`\\b${oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      code = code.replace(regex, newName);
    });

    return code;
  }

  private simplifyExpressions(code: string): string {
    // Simplify basic math expressions
    code = code.replace(/(\d+)\s*\+\s*0\b/g, '$1');
    code = code.replace(/0\s*\+\s*(\d+)/g, '$1');
    code = code.replace(/(\d+)\s*\*\s*1\b/g, '$1');
    code = code.replace(/1\s*\*\s*(\d+)/g, '$1');
    
    // Simplify boolean expressions
    code = code.replace(/true\s*and\s*(.+)/g, '$1');
    code = code.replace(/(.+)\s*and\s*true/g, '$1');
    code = code.replace(/false\s*or\s*(.+)/g, '$1');
    code = code.replace(/(.+)\s*or\s*false/g, '$1');
    
    return code;
  }

  private removeDeadCode(code: string): string {
    // Remove empty functions
    code = code.replace(/function\s+\w+\s*\(\s*\)\s*end/g, '');
    
    // Remove unused variable declarations (basic)
    code = code.replace(/local\s+\w+\s*=\s*nil\s*;?\s*\n/g, '');
    
    return code;
  }

  private finalFormat(code: string): string {
    // Clean up extra whitespace
    code = code.replace(/\n\s*\n\s*\n/g, '\n\n');
    code = code.replace(/^\s+|\s+$/g, '');
    
    // Ensure consistent spacing around operators
    code = code.replace(/\s*=\s*/g, ' = ');
    code = code.replace(/\s*\+\s*/g, ' + ');
    code = code.replace(/\s*-\s*/g, ' - ');
    code = code.replace(/\s*\*\s*/g, ' * ');
    code = code.replace(/\s*\/\s*/g, ' / ');
    
    return code;
  }
}

export const deobfuscator = new MoonsecV3Deobfuscator();