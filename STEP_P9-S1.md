# OnionReel v1 Artifact: Stock Ingestion v1 (Pexels/No-Key Fallback)

## Overview
This artifact outlines the implementation of Stock Ingestion v1, which integrates Pexels as the primary source for stock media. In cases where API keys are unavailable, a fallback mechanism will be employed. The artifact also includes a manifest for tracking ingested media and a caching mechanism to optimize performance.

## Inputs
- **Pexels API Key** (optional): Required for accessing Pexels media.
- **Fallback Source**: A predefined local or alternative source for stock media when the API key is not available.
- **Configuration Settings**: Parameters for cache duration, manifest file location, and download settings.

## Outputs
- **Ingested Media**: Stock images/videos downloaded from Pexels or fallback source.
- **Manifest File**: A JSON or CSV file listing all ingested media with metadata (e.g., source, URL, download timestamp).
- **Cache Directory**: A local directory containing cached stock media for quick access.

## Steps
1. **Configuration Setup**:
   - Load configuration settings for API key, fallback source, and cache parameters.

2. **API Key Check**:
   - Verify if the Pexels API key is available.
   - If available, proceed to step 3. If not, skip to step 5.

3. **Pexels Media Ingestion**:
   - Use the Pexels API to fetch stock media based on predefined criteria (e.g., categories, search terms).
   - Download the media files and store them in the cache directory.
   - Update the manifest file with the details of the ingested media.

4. **Error Handling**:
   - Implement error handling for API requests (e.g., rate limits, connection issues).
   - Log errors and proceed to fallback if necessary.

5. **Fallback Media Ingestion**:
   - Access the predefined fallback source.
   - Download available stock media and store them in the cache directory.
   - Update the manifest file with the details of the fallback media.

6. **Cache Management**:
   - Implement cache expiration logic based on configuration settings.
   - Ensure that the cache directory is cleaned up periodically to free up space.

7. **Finalize and Document**:
   - Ensure the manifest file is properly formatted and saved.
   - Document the process and any configurations for future reference.

## Pitfalls
- **API Rate Limits**: Pexels has usage limits; ensure proper handling and backoff strategies.
- **Fallback Source Availability**: Ensure the fallback source is reliable and contains sufficient media.
- **Cache Management**: Improper cache management could lead to storage issues; implement cleanup routines.
- **Manifest File Integrity**: Ensure the manifest file is updated correctly to avoid data inconsistencies.
- **Error Handling**: Neglecting robust error handling may lead to incomplete media ingestion.

This artifact serves as a foundational step in enhancing OnionReel's stock media capabilities, ensuring a seamless user experience regardless of API availability.
