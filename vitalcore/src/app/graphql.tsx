import { GraphQLClient } from "graphql-request";

// Initialize the GraphQL client
const client = new GraphQLClient("http://localhost:3306/graphql");

// Define types for your models
interface Gene {
  id: string;
  name: string;
  impact_on_lifespan: number;  // Adjusted field name to match GraphQL response
}

interface AddGeneResponse {
  addGene: Gene;
}

interface ModifyGeneResponse {
  modifyGeneActivity: Gene;  // Adjusted to the correct mutation name
}

interface GetGenesResponse {
  getGenes: Gene[];
}

// Fetch all genes
export const getGenes = async (): Promise<Gene[]> => {
  const query = `
    query {
      getGenes {
        id
        gene_name
        impact_on_lifespan
      }
    }
  `;
  const response = await client.request<GetGenesResponse>(query);
  return response.getGenes;
};
export const addGene = async (
  gene_name: string,       // Updated to match schema field name
  mutation_rate: number,   // Ensure this is a Float, since mutation_rate is Float!
  impact_on_lifespan: number  // Keep this as Int, matching schema
): Promise<Gene> => {
  const mutation = `
    mutation ($gene_name: String!, $mutation_rate: Float!, $impact_on_lifespan: Int) {
      addGene(gene_name: $gene_name, mutation_rate: $mutation_rate, impact_on_lifespan: $impact_on_lifespan) {
        id
        gene_name
        mutation_rate
        impact_on_lifespan
      }
    }
  `;

  const variables = { gene_name, mutation_rate, impact_on_lifespan };

  const response = await client.request<AddGeneResponse>(mutation, variables);
  return response.addGene;
};



// Modify an existing gene
export const modifyGene = async (
  id: string,
  impact_on_lifespan: number  // Adjusted field name
): Promise<Gene> => {
  const mutation = `
  mutation ($id: String!, $impact_on_lifespan: Int!) {
    modifyGeneActivity(id: $id, impact_on_lifespan: $impact_on_lifespan) {
      id
      gene_name
      impact_on_lifespan
    }
  }
`;

  const variables = { id, impact_on_lifespan };

  const response = await client.request<ModifyGeneResponse>(mutation, variables);
  return response.modifyGeneActivity;  // Adjusted field name to match the mutation response
};
