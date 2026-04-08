# OnionReel Benchmark Library Plan v1

## Purpose
The OnionReel Benchmark Library is designed to facilitate regression testing across creative outputs, quality control (QC), and pipeline speed. By establishing a robust framework, we aim to ensure that all creative outputs meet predefined standards while optimizing production efficiency.

## What Goes in the Library
1. **Example Briefs**: A collection of standard briefs that represent various project types and complexity levels. These will serve as templates for future projects.
  
2. **Scripts**: A repository of scripts that align with the example briefs, showcasing different narrative styles and formats.

3. **Assets**: A library of visual and audio assets (images, videos, sound bites) that can be used in testing to ensure consistency and quality.

4. **Target Exports**: Defined export formats and resolutions that align with industry standards and client specifications.

5. **QC Expectations**: Documented quality control criteria, including visual fidelity, audio clarity, and adherence to project briefs.

## Benchmarks
1. **Speed**: Measure time-to-first-cut from project initiation to the first deliverable. This will be tracked in seconds and compared against historical data.

2. **Quality**: Implement a rubric scoring system (1-10) to evaluate creative outputs based on predefined criteria, including creativity, adherence to brief, and technical execution.

3. **Consistency**: Assess the stylistic coherence of outputs across different projects, ensuring that the brand voice and visual identity remain intact.

## How to Store Benchmarks in the Artifact Store
- Each benchmark will be assigned a unique identifier (ID) for easy retrieval.
- Metadata will include:
  - Project type
  - Date of benchmark
  - Brief ID
  - Script ID
  - Asset ID
  - Rubric scores
  - Time-to-first-cut
  - Consistency rating
- All data will be stored in a structured format to enable efficient querying and reporting.

## How to Run Benchmarks Periodically
- **Schedule**: Benchmarks will be executed on a bi-weekly basis, coinciding with the completion of key projects or creative milestones.
  
- **Reporting**: Results will be compiled into a comprehensive report detailing:
  - Speed metrics
  - Quality rubric scores
  - Consistency evaluations
  - Comparative analysis against historical benchmarks
- Reports will be distributed to all stakeholders for review and action.

## Acceptance Criteria
1. **Speed**: Time-to-first-cut must not exceed the established threshold based on historical averages.

2. **Quality**: At least 80% of outputs must score above a predetermined quality threshold on the rubric.

3. **Consistency**: Outputs must demonstrate a minimum consistency rating of 75% across projects.

4. **Documentation**: All benchmarks must be accurately recorded in the Artifact Store with complete metadata.

5. **Feedback Loop**: A mechanism for continuous improvement based on benchmark results must be established, allowing for adjustments to processes and standards as needed.

By adhering to this plan, the OnionReel Benchmark Library will serve as a vital tool in maintaining high standards for creative output, ensuring efficiency, and fostering continuous improvement within the production pipeline.
