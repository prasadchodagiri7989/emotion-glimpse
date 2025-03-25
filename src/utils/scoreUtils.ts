
import { ScoreMetric } from "@/components/ScoreCard";

// Simulates a backend scoring process - in a real app, this would be replaced with actual AI analysis
export async function analyzeInterviewVideo(videoFile: File): Promise<{
  overallScore: number;
  metrics: ScoreMetric[];
}> {
  // This is just a simulation - in a real app, you would send the video to a backend for processing
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Generate only the requested metrics
      const metrics: ScoreMetric[] = [
        {
          name: "Body Language",
          score: Math.floor(Math.random() * 30) + 50, // 50-80 range
          description: "Posture, hand gestures, and overall presence"
        },
        {
          name: "Eye Contact",
          score: Math.floor(Math.random() * 35) + 55, // 55-90 range
          description: "Frequency and quality of eye contact during responses"
        },
        {
          name: "Confidence",
          score: Math.floor(Math.random() * 30) + 60, // 60-90 range
          description: "Level of self-assurance and composure during the interview"
        }
      ];

      // Calculate overall score (weighted average)
      const overallScore = Math.floor(
        metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length
      );

      resolve({
        overallScore,
        metrics
      });
    }, 3000); // Simulate 3 seconds of processing
  });
}

// Function to generate PDF report
export async function generatePdfReport(overallScore: number, metrics: ScoreMetric[]): Promise<Blob> {
  // This import is done dynamically to avoid SSR issues
  const { default: jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(22);
  doc.setTextColor(0, 51, 153);
  doc.text("Interview Performance Report", 105, 20, { align: "center" });
  
  // Add date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
  
  // Add overall score
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Overall Score: ${overallScore}`, 20, 50);
  
  // Add score interpretation
  let gradeText = "";
  if (overallScore >= 90) gradeText = "Excellent";
  else if (overallScore >= 80) gradeText = "Very Good";
  else if (overallScore >= 70) gradeText = "Good";
  else if (overallScore >= 60) gradeText = "Above Average";
  else if (overallScore >= 50) gradeText = "Average";
  else gradeText = "Needs Improvement";
  
  doc.text(`Performance Grade: ${gradeText}`, 20, 60);
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 65, 190, 65);
  
  // Add detailed metrics
  doc.setFontSize(14);
  doc.text("Detailed Metrics", 20, 75);
  
  let yPosition = 85;
  metrics.forEach(metric => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${metric.name}: ${metric.score}/100`, 20, yPosition);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(metric.description, 20, yPosition + 6);
    
    yPosition += 20;
  });
  
  // Add recommendations section
  yPosition += 10;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Recommendations", 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  // Custom recommendations based on metrics
  metrics.forEach(metric => {
    let recommendation = "";
    if (metric.score < 60) {
      if (metric.name === "Body Language") {
        recommendation = "Practice more conscious control of posture and hand movements.";
      } else if (metric.name === "Eye Contact") {
        recommendation = "Work on maintaining consistent eye contact during conversations.";
      } else if (metric.name === "Confidence") {
        recommendation = "Prepare thoroughly and practice mock interviews to build confidence.";
      }
      
      if (recommendation) {
        doc.text(`• ${metric.name}: ${recommendation}`, 20, yPosition);
        yPosition += 8;
      }
    }
  });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("InterviewScore - AI-Powered Interview Analysis", 105, 280, { align: "center" });
  
  return doc.output('blob');
}
