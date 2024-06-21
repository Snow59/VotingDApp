'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi, contractAddress } from '@/constants';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { useState } from 'react';

export default function Home() {
  const { isConnected } = useAccount();

  const [voterAddress, setVoterAddress] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalId, setProposalId] = useState(0);
  const [winner, setWinner] = useState('');
  const [proposalListHtml, setProposalListHtml] = useState("");


  // Read the winner from the contract
  const readWinner = async () => {
    try {
      const data = await useContractRead({
        address: contractAddress,
        abi: abi,
        functionName: 'getWinner',
      });
      setWinner(data);
    } catch (error) {
      console.error('Error reading winner:', error);
    }
  };

  // Register a voter
  const { write: registerVoter } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'registerVoter',
    args: [voterAddress],
  });

  // Start proposal registration
  const { write: startProposalsRegistration } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'startProposalsRegistration',
  });

  async function fetchProposals() {
    try {
      const proposals = await useContractRead({
        address: contractAddress,
        abi: abi,
        functionName: 'getProposals',
      });
      const proposalsList = document.getElementById('proposals-list');

      proposals.forEach(proposal => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<p>ID: ${proposal.id.toString()}</p>
                              <p>Description: ${proposal.description}</p>
                              <p>Vote Count: ${proposal.voteCount.toString()}</p>`;
        proposalsList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des propositions :', error);
    }
  }

  

  // End proposal registration
  const { write: endProposalsRegistration } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'endProposalsRegistration',
  });



  // Submit a proposal
  const { write: submitProposal } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'submitProposal',
    args: [proposalDescription],
  });

  // Start voting session
  const { write: startVotingSession } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'startVotingSession',
  });

  // Vote on a proposal
  const { write: voteForProposal } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'vote',
    args: [proposalId],
  });

  // Tally votes
  const { write: tallyVotes } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'tallyVotes',
  });


  return (
    <>
      <ConnectButton />
      {isConnected ? (
        <div>
          <input
            placeholder="Voter Address"
            onChange={(e) => setVoterAddress(e.target.value)}
            value={voterAddress}
          />
          <button onClick={async () => {
            try {
              await registerVoter();
            } catch (error) {
              console.error('Error registering voter:', error);
            }
          }}>Register Voter</button><br></br><br></br>

          <button onClick={async () => {
            try {
              await startProposalsRegistration();
            } catch (error) {
              console.error('Error starting proposals registration:', error);
            }
          }}>Start Proposals Registration</button><br></br><br></br>
          
          <input
            placeholder="Proposal Description"
            onChange={(e) => setProposalDescription(e.target.value)}
            value={proposalDescription}
          />
          <button onClick={async () => {
            try {
              await submitProposal();
            } catch (error) {
              console.error('Error submitting proposal:', error);
            }
          }}>Submit Proposal</button><br></br><br></br>

          <button onClick={async () => {
            try {
              await endProposalsRegistration();
            } catch (error) {
              console.error('Error ending proposals registration:', error);
            }
          }}>End Proposals Registration</button><br></br><br></br>

          <button onClick={async () => {
            try {
              await startVotingSession();
            } catch (error) {
              console.error('Error starting voting session:', error);
            }
          }}>Start Voting Session</button><br></br><br></br>

          <h2>Proposals</h2>
          <ul id="proposalsList">
            <li>Proposals will be shown here</li>
          </ul>
          <button onClick={async () =>{fetchProposals()}}>Refresh Proposals List</button><br/><br/>

          <input
            type="number"
            placeholder="Proposal ID"
            onChange={(e) => setProposalId(Number(e.target.value))}
            value={proposalId}
          />
          <button onClick={async () => {
            try {
              await voteForProposal();
            } catch (error) {
              console.error('Error voting for proposal:', error);
            }
          }}>Vote for Proposal</button><br></br><br></br>

          <button onClick={async () => {
            try {
              await tallyVotes();
            } catch (error) {
              console.error('Error tallying votes:', error);
            }
          }}>Tally Votes</button>

<button onClick={async () => {
            try {
              await readWinner();
              alert('The wining proposal is '+winner);
            } catch (error) {
              console.error('Error reading wining proposal:', error);
            }
          }}>Tally Votes</button>
        </div>
      ) : (
        <p>Please connect your Wallet to interact with the DApp.</p>
      )}
    </>
  );
}
