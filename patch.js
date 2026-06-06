const fs = require('fs');
const file = 'components/AutomatedWorkflow.tsx';
let code = fs.readFileSync(file, 'utf8');

const original = `
      // --- STEP 1: Disambiguation ---
      updateStep('disambiguation', { status: 'running' });
      if (signal.aborted) throw new Error('Aborted');

      const disambiguationResponse = await ai.models.generateContent({
        model,
        contents: \`Analyze the following expression: "\${input}".
        The context is strictly: "\${domainContext}".
        Identify all mathematical or scientific symbols and disambiguate their meaning.\`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                meaning: { type: Type.STRING },
                domain: { type: Type.STRING }
              },
              required: ['symbol', 'meaning', 'domain']
            }
          }
        }
      });

      const disambiguationData = JSON.parse(disambiguationResponse.text || '[]');
      updateStep('disambiguation', { status: 'success', result: disambiguationData });

      // --- STEP 2: Atomic Tokenization ---
      updateStep('tokenization', { status: 'running' });
      if (signal.aborted) throw new Error('Aborted');

      const symbolsToTokenize = disambiguationData.map((d: DisambiguationData) => d.symbol).join(', ');

      const tokenizationResponse = await ai.models.generateContent({
        model,
        contents: \`Analyze these STEM symbols: \${symbolsToTokenize}.
        Context: "\${domainContext}".
        Generate a FoNE-inspired semantic embedding profile for each.\`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                symbol: { type: Type.STRING },
                atomic_token_id: { type: Type.INTEGER },
                fone_embedding: {
                  type: Type.OBJECT,
                  properties: {
                    operator_class: { type: Type.STRING },
                    tensor_rank_effect: { type: Type.STRING }
                  },
                  required: ['operator_class', 'tensor_rank_effect']
                }
              },
              required: ['symbol', 'atomic_token_id', 'fone_embedding']
            }
          }
        }
      });

      const tokenizationData = JSON.parse(tokenizationResponse.text || '[]');
      updateStep('tokenization', { status: 'success', result: tokenizationData });

      // --- STEP 3: Neuro-Symbolic Executor ---
      updateStep('executor', { status: 'running' });
      if (signal.aborted) throw new Error('Aborted');

      const executorResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Use pro for execution
        contents: \`Act as a Neuro-Symbolic Executor.
        Evaluate or explain the following expression step-by-step: "\${input}".
        Domain: "\${domainContext}".
        Provide a structured breakdown of the execution path.\`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              execution_path: { type: Type.STRING },
              final_result: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ['execution_path', 'final_result', 'confidence']
          }
        }
      });

      const executorData = JSON.parse(executorResponse.text || '{}');
      updateStep('executor', { status: 'success', result: executorData });

      // --- STEP 4: Interpretability Dashboard ---
      updateStep('dashboard', { status: 'running' });
      if (signal.aborted) throw new Error('Aborted');

      const dashboardResponse = await ai.models.generateContent({
        model,
        contents: \`Provide an interpretability summary for the expression: "\${input}" in the context of "\${domainContext}".
        Explain the physical or mathematical intuition behind it concisely.\`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intuition: { type: Type.STRING },
              key_concepts: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['intuition', 'key_concepts']
          }
        }
      });

      const dashboardData = JSON.parse(dashboardResponse.text || '{}');
      updateStep('dashboard', { status: 'success', result: dashboardData });
`;

const replacement = `
      // We run independent paths in parallel to optimize execution time
      const runPath1 = async () => {
        // --- STEP 1: Disambiguation ---
        updateStep('disambiguation', { status: 'running' });
        if (signal.aborted) throw new Error('Aborted');

        const disambiguationResponse = await ai.models.generateContent({
          model,
          contents: \`Analyze the following expression: "\${input}".
          The context is strictly: "\${domainContext}".
          Identify all mathematical or scientific symbols and disambiguate their meaning.\`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  domain: { type: Type.STRING }
                },
                required: ['symbol', 'meaning', 'domain']
              }
            }
          }
        });

        const disambiguationData = JSON.parse(disambiguationResponse.text || '[]');
        updateStep('disambiguation', { status: 'success', result: disambiguationData });

        // --- STEP 2: Atomic Tokenization ---
        updateStep('tokenization', { status: 'running' });
        if (signal.aborted) throw new Error('Aborted');

        const symbolsToTokenize = disambiguationData.map((d: DisambiguationData) => d.symbol).join(', ');

        const tokenizationResponse = await ai.models.generateContent({
          model,
          contents: \`Analyze these STEM symbols: \${symbolsToTokenize}.
          Context: "\${domainContext}".
          Generate a FoNE-inspired semantic embedding profile for each.\`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING },
                  atomic_token_id: { type: Type.INTEGER },
                  fone_embedding: {
                    type: Type.OBJECT,
                    properties: {
                      operator_class: { type: Type.STRING },
                      tensor_rank_effect: { type: Type.STRING }
                    },
                    required: ['operator_class', 'tensor_rank_effect']
                  }
                },
                required: ['symbol', 'atomic_token_id', 'fone_embedding']
              }
            }
          }
        });

        const tokenizationData = JSON.parse(tokenizationResponse.text || '[]');
        updateStep('tokenization', { status: 'success', result: tokenizationData });

        return { disambiguationData, tokenizationData };
      };

      const runPath2 = async () => {
        // --- STEP 3: Neuro-Symbolic Executor ---
        updateStep('executor', { status: 'running' });
        if (signal.aborted) throw new Error('Aborted');

        const executorResponse = await ai.models.generateContent({
          model: 'gemini-2.5-pro', // Use pro for execution
          contents: \`Act as a Neuro-Symbolic Executor.
          Evaluate or explain the following expression step-by-step: "\${input}".
          Domain: "\${domainContext}".
          Provide a structured breakdown of the execution path.\`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                execution_path: { type: Type.STRING },
                final_result: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              },
              required: ['execution_path', 'final_result', 'confidence']
            }
          }
        });

        const executorData = JSON.parse(executorResponse.text || '{}');
        updateStep('executor', { status: 'success', result: executorData });
        return executorData;
      };

      const runPath3 = async () => {
        // --- STEP 4: Interpretability Dashboard ---
        updateStep('dashboard', { status: 'running' });
        if (signal.aborted) throw new Error('Aborted');

        const dashboardResponse = await ai.models.generateContent({
          model,
          contents: \`Provide an interpretability summary for the expression: "\${input}" in the context of "\${domainContext}".
          Explain the physical or mathematical intuition behind it concisely.\`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                intuition: { type: Type.STRING },
                key_concepts: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['intuition', 'key_concepts']
            }
          }
        });

        const dashboardData = JSON.parse(dashboardResponse.text || '{}');
        updateStep('dashboard', { status: 'success', result: dashboardData });
        return dashboardData;
      };

      const [
        { disambiguationData, tokenizationData },
        executorData,
        dashboardData
      ] = await Promise.all([runPath1(), runPath2(), runPath3()]);
`;

code = code.replace(original, replacement);

const errorHandlingOriginal = `
    } catch (err: any) {
      if (err.message !== 'Aborted') {
        const currentRunningStep = steps.find(s => s.status === 'running');
        if (currentRunningStep) {
          updateStep(currentRunningStep.id, { status: 'error', error: parseAIError(err) });
        }
      }
      setIsRunning(false);
    }
`;

const errorHandlingReplacement = `
    } catch (err: any) {
      if (err.message !== 'Aborted') {
        setSteps(prev => prev.map(s => s.status === 'running' ? { ...s, status: 'error', error: parseAIError(err) } : s));
      }
      setIsRunning(false);
    }
`;

code = code.replace(errorHandlingOriginal, errorHandlingReplacement);

fs.writeFileSync(file, code);
